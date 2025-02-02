type Options = {
    seed?: string;
    size?: number;
    scale?: number;
    color?: string;
    bgcolor?: string;
    spotcolor?: string;
};

const randseed: number[] = new Array(4).fill(0);

function seedrand(seed: string): void {
    randseed.fill(0);
    for (let i = 0; i < seed.length; i++) {
        const index = i % 4;
        randseed[index] =
            ((randseed[index] ?? 0) << 5) - (randseed[index] ?? 0) + seed.charCodeAt(i);
    }
}

function rand(): number {
    if (randseed.some((value) => value === undefined)) {
        throw new Error("randseed is not properly initialized");
    }
    const t = (randseed[0] ?? 0) ^ ((randseed[0] ?? 0) << 11);
    randseed[0] = randseed[1] ?? 0;
    randseed[1] = randseed[2] ?? 0;
    randseed[2] = randseed[3] ?? 0;
    randseed[3] = (randseed[3] ?? 0) ^ ((randseed[3] ?? 0) >> 19) ^ t ^ (t >> 8);
    return ((randseed[3] ?? 0) >>> 0) / ((1 << 31) >>> 0);
}

function createColor(): string {
    const h = Math.floor(rand() * 360);
    const s = `${rand() * 60 + 40}%`;
    const l = `${(rand() + rand() + rand() + rand()) * 25}%`;
    return `hsl(${h},${s},${l})`;
}

function createImageData(size: number): number[] {
    const width = size;
    const height = size;
    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;
    const data: number[] = [];

    for (let y = 0; y < height; y++) {
        let row: number[] = [];
        for (let x = 0; x < dataWidth; x++) {
            row[x] = Math.floor(rand() * 2.3);
        }
        const r = row.slice(0, mirrorWidth).reverse();
        row = row.concat(r);
        data.push(...row);
    }

    return data;
}

function buildOpts(opts: Options): Required<Options> {
    const seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
    seedrand(seed);
    return {
        seed,
        size: opts.size || 8,
        scale: opts.scale || 4,
        color: opts.color || createColor(),
        bgcolor: opts.bgcolor || createColor(),
        spotcolor: opts.spotcolor || createColor(),
    };
}

export function renderIcon(opts: Options, canvas: HTMLCanvasElement): HTMLCanvasElement {
    const builtOpts = buildOpts(opts);
    const imageData = createImageData(builtOpts.size);
    const width = Math.sqrt(imageData.length);
    canvas.width = canvas.height = builtOpts.size * builtOpts.scale;
    const cc = canvas.getContext("2d");
    if (!cc) throw new Error("Canvas context not available");

    cc.fillStyle = builtOpts.bgcolor;
    cc.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.length; i++) {
        if (imageData[i]) {
            const row = Math.floor(i / width);
            const col = i % width;
            cc.fillStyle = imageData[i] === 1 ? builtOpts.color : builtOpts.spotcolor;
            cc.fillRect(
                col * builtOpts.scale,
                row * builtOpts.scale,
                builtOpts.scale,
                builtOpts.scale
            );
        }
    }

    return canvas;
}

export function createIcon(opts: Options): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    return renderIcon(opts, canvas);
}
