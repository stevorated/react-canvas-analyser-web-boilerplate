import axios from 'axios';

type Styles = {
    fftSize: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    level: number;
};

type Displays = {
    frequencyC?: HTMLCanvasElement | null;
    sinewaveC?: HTMLCanvasElement | null;
};

type Events = 'onsongend' | 'changeposition' | 'cleancartridge';

type AudioHandlerStatus = 'INIT' | 'READY' | 'PLAY' | 'PAUSE' | 'STOP' | 'ADD' | 'BUSY';

export class AudioHandler {
    private position: number | null = null;
    private timestamp: number | null = null;
    private timestampHandler: number | null = null;
    private sampleRate: number | null = null;
    private duration = 0;
    private pointer = 0;
    private volume = 0.5;
    private releaseTime = 0.1;
    private status: AudioHandlerStatus = 'INIT';
    private timestampIntervalTick = 1000;

    private sinewaveC: HTMLCanvasElement | null | undefined = null;
    private frequencyC: HTMLCanvasElement | null | undefined = null;
    private styles: Styles | null = null;

    private source: AudioBufferSourceNode | null = null;
    private context: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private frequencyDataArray: Uint8Array | null = null;
    private sinewaveDataArray: Uint8Array | null = null;
    private sinewaveСanvasCtx: CanvasRenderingContext2D | null = null;
    private frequencyСanvasCtx: CanvasRenderingContext2D | null = null;

    private gainNode: GainNode | null = null;
    private buffers: (AudioBuffer | undefined)[] = [];

    private grabAudioContext = (): void => {
        this.context = new window.AudioContext();
        this.analyser = this.context.createAnalyser();
    };

    addFiles = async (urls: string[]) => {
        const cartridge = await Promise.all(urls.map((url) => axios.get(url, { responseType: 'arraybuffer' })));

        const buffers = await Promise.all(cartridge.map((res) => this.context?.decodeAudioData(res.data)));

        this.buffers = this.buffers.concat(buffers);
        if (this.status !== 'PLAY') {
            this.status = 'READY';
        }
    };

    loadFiles = async (urls: string[], { frequencyC, sinewaveC }: Displays, styles: Styles): Promise<void> => {
        const cartridge = await Promise.all(urls.map((url) => axios.get(url, { responseType: 'arraybuffer' })));

        this.grabAudioContext();

        if (!this.context || !this.analyser) {
            return;
        }

        this.styles = styles;
        this.sinewaveC = sinewaveC;
        this.frequencyC = frequencyC;
        this.gainNode = this.context.createGain();

        this.buffers = await Promise.all(cartridge.map((res) => this.context?.decodeAudioData(res.data)));

        this.updateDuration();
        this.updateSampleRate();

        this.analyser.fftSize = styles.fftSize;

        this.frequencyDataArray = new Uint8Array(this.analyser.frequencyBinCount);

        this.sinewaveDataArray = new Uint8Array(this.analyser.fftSize);

        this.createFrequencyCanvasContext(frequencyC);
        this.createSinewaveCavasContext(sinewaveC);

        if (this.status !== 'PLAY') {
            this.status = 'READY';
        }
    };

    clean = () => {
        this.buffers = [];
        this.stop();
        this.duration = 0;
        this.status = 'INIT';
        this.dispatchEvent('cleancartridge');
    };

    private createSinewaveCavasContext = (sinewaveC: HTMLCanvasElement | null | undefined) => {
        if (!sinewaveC) return;

        this.sinewaveСanvasCtx = sinewaveC.getContext('2d');
        this.sinewaveСanvasCtx?.clearRect(0, 0, sinewaveC.width, sinewaveC.height);
    };

    private createFrequencyCanvasContext = (frequencyC: HTMLCanvasElement | null | undefined) => {
        if (!frequencyC) return;

        this.frequencyСanvasCtx = frequencyC.getContext('2d');
        this.frequencyСanvasCtx?.clearRect(0, 0, frequencyC.width, frequencyC.height);
    };

    updateSampleRate = () => {
        this.sampleRate = this.buffers[this.pointer]?.sampleRate || 0;
    };

    getSampleRate = () => {
        return this.sampleRate;
    };

    getPointer = () => {
        return this.pointer;
    };

    updateDuration = () => {
        this.duration = this.buffers[this.pointer]?.duration || 0;
    };

    getDuration = () => {
        return this.duration;
    };

    getStatus = () => {
        return this.status;
    };

    setPosition = (position: number) => {
        this.position = position;
    };

    getPosition = () => {
        return this.position || 0;
    };

    getTimestamp = () => {
        return this.timestamp;
    };

    getVolume = () => {
        return this.volume;
    };

    setVolume = (level: number) => {
        this.volume = level;

        if (!this.context || !this.gainNode) {
            return;
        }

        this.gainNode.gain.value = this.volume;
    };

    play = (resumeTime = this.position ? this.position || 0 : 0) => {
        if (
            this.status === 'PLAY' ||
            this.status === 'INIT' ||
            this.status === 'BUSY' ||
            !this.context ||
            !this.gainNode ||
            !this.analyser
        ) {
            return;
        }

        // don't interupt
        this.status = 'BUSY';

        this.source = this.context.createBufferSource();

        if (!this.source) {
            return;
        }

        this.source.buffer = this.buffers?.[this.pointer] || null;

        // source -> gain
        this.source.connect(this.gainNode);
        // gain -> distination
        this.gainNode.connect(this.context.destination);

        this.gainNode.gain.value = this.volume;

        // source -> analyser
        this.source.connect(this.analyser);

        // set start timestamp
        this.timestamp = Date.now();

        // dispath initial changeposition set interval for events for position
        this.dispatchEvent('changeposition');

        this.timestampHandler = setInterval(() => {
            this.dispatchEvent('changeposition');

            const now = Date.now();
            const delta = (now - (this.timestamp || 0)) / 1000;
            this.position ? (this.position += delta) : (this.position = delta);
            this.timestamp = now;

            if (this.position && this.position > this.getDuration()) {
                this.timestampHandler && clearInterval(this.timestampHandler);
                this.dispatchEvent('onsongend');

                this.position = 0;
            }
        }, this.timestampIntervalTick); // TODO: fix this uglyness

        // start the track at resume time
        this.source.start(0, resumeTime);

        // draw canvas
        this.drawFrequency();
        this.drawSinewave();

        // done
        this.status = 'PLAY';
    };

    dispatchEvent = (eventName: Events) => {
        const event = new Event(eventName);
        window.dispatchEvent(event);
    };

    stop = () => {
        this.timestampHandler && clearInterval(this.timestampHandler);
        this.status = 'STOP';
        this.position = 0;

        this.dispatchEvent('changeposition');

        this.gainNode?.gain.linearRampToValueAtTime(0, this.releaseTime);

        setTimeout(() => {
            this.source && this.source.stop(0);
        }, this.releaseTime);
    };

    pause = () => {
        if (this.status === 'BUSY') {
            return;
        }

        this.timestampHandler && clearInterval(this.timestampHandler);
        this.status = 'PAUSE';

        if (this.position) {
            this.position += (Date.now() - (this.timestamp || 0)) / 1000;
        } else {
            this.position = (Date.now() - (this.timestamp || 0)) / 1000;
        }

        this.gainNode?.gain.linearRampToValueAtTime(0, this.releaseTime);

        setTimeout(() => {
            this.source && this.source.stop(0);
        }, this.releaseTime);
    };

    private changeSourceAndBuffer = () => {
        const playing = this.status === 'PLAY';

        this.stop();
        this.updateDuration();
        this.updateSampleRate();

        setTimeout(() => {
            playing && this.play(0);
        }, 20);
    };

    nextsong = () => {
        if (this.pointer < this.buffers.length - 1) {
            this.pointer += 1;
        } else {
            return;
        }

        this.changeSourceAndBuffer();
    };

    lastsong = () => {
        if (this.getPosition() > 5 || this.pointer === 0) {
            this.setPosition(0);
        } else if (this.pointer > 0) {
            this.pointer -= 1;
        } else {
            return;
        }

        this.changeSourceAndBuffer();
    };

    private drawSinewave = () => {
        if (!this.sinewaveC || !this.analyser || !this.sinewaveDataArray || !this.sinewaveСanvasCtx || !this.styles) {
            return;
        }

        this.analyser.getByteTimeDomainData(this.sinewaveDataArray);
        requestAnimationFrame(this.drawSinewave);

        this.sinewaveСanvasCtx.fillStyle = this.styles.fillStyle;

        this.sinewaveСanvasCtx.fillRect(0, 0, this.sinewaveC.width, this.sinewaveC.height);
        this.sinewaveСanvasCtx.lineWidth = this.styles.lineWidth;

        this.sinewaveСanvasCtx.strokeStyle = this.styles.strokeStyle;
        this.sinewaveСanvasCtx.beginPath();

        const sliceWidth = (this.sinewaveC.width * 1.0) / this.analyser.fftSize;
        let x = 0;

        for (let i = 0; i < this.analyser.fftSize; i++) {
            const v = this.sinewaveDataArray[i] / 128.0; // byte / 2 || 256 / 2
            const y = (v * this.sinewaveC.height) / 2;

            if (i === 0) {
                this.sinewaveСanvasCtx.moveTo(x, y);
            } else {
                this.sinewaveСanvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        this.sinewaveСanvasCtx.lineTo(this.sinewaveC.width, this.sinewaveC.height / 2);
        this.sinewaveСanvasCtx.stroke();
    };

    private drawFrequency = () => {
        if (
            !this.frequencyC ||
            !this.analyser ||
            !this.frequencyDataArray ||
            !this.frequencyСanvasCtx ||
            !this.styles
        ) {
            return;
        }

        this.analyser.getByteFrequencyData(this.frequencyDataArray);

        requestAnimationFrame(this.drawFrequency);

        this.frequencyСanvasCtx.fillStyle = this.styles.fillStyle;
        this.frequencyСanvasCtx?.fillRect(0, 0, this.frequencyC.width, this.frequencyC.height);
        this.frequencyСanvasCtx?.beginPath();

        const barWidth = (this.frequencyC.width / this.analyser.frequencyBinCount) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
            barHeight = this.frequencyDataArray[i];

            this.frequencyСanvasCtx.fillStyle = this.styles.strokeStyle;
            this.frequencyСanvasCtx.fillRect(x, this.frequencyC.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    };
}
