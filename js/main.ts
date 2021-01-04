const CANVAS_WIDTH = 860;
const CANVAS_HEIGHT = 640;
const N = 5;


abstract class Geometry {
    static centerPos(elementLength: number, containerLength: number): number {
        return (containerLength - elementLength) / 2;
    }
}


abstract class MyColor {
    static readonly whiteGray = '#eee';
    static readonly lightGray = '#999';
    static readonly darkGray = '#333';
    static readonly submarine_red = '#CB2400';
    static readonly submarine_blue = '#236CCA'
}

interface Scene {
    sceneChanger: SceneChanger;
    setup: (sceneChanger_: SceneChanger) => void;
    tearDown: () => void;
    update: (timestamp: number) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}


interface SceneChanger {
    canvas: HTMLCanvasElement;
    changeScene: (nextScene: Scene) => void;
}


class Visualizer implements SceneChanger {
    readonly canvas: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    curScene: Scene;

    constructor(canvas: HTMLCanvasElement, scene: Scene) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.curScene = scene;

        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        scene.setup(this);

        this.ctx.textAlign = 'center';
    }

    run(): void {
        const animationLoop = (timestamp: number): void => {
            this.curScene.update(timestamp);
            this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            this.curScene.draw(this.ctx);
            requestAnimationFrame(animationLoop);
        };
        requestAnimationFrame(animationLoop);
    }

    changeScene(nextScene: Scene): void {
        this.curScene.tearDown();
        this.curScene = nextScene;
        this.curScene.setup(this);
    }
}

class Cell {
    static readonly DEFAULT_FILL_COLOR = MyColor.whiteGray;
    static readonly DEFAULT_BORDER_COLOR = MyColor.lightGray;
    static readonly DEFAULT_BORDER_THICKNESS = 2;

    isMouseHovering: boolean = false;
    fillColor: string;
    borderColor: string;
    borderThickness: number;

    constructor(public x: number,
                public y: number,
                public width: number,
                public height: number,
                public readonly row: number,
                public readonly col: number
    ) {
        this.becomeDefaultAppearance();
    }

    becomeDefaultAppearance(): void {
        this.fillColor = Cell.DEFAULT_FILL_COLOR;
        this.borderColor = Cell.DEFAULT_BORDER_COLOR;
        this.borderThickness = Cell.DEFAULT_BORDER_THICKNESS;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.fillColor;
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = this.borderThickness;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}


class TitleScene implements Scene {
    sceneChanger: SceneChanger;
    private readonly clickHandler: EventListener;

    constructor() {
        this.clickHandler = () => {
            console.log("[TitleScene#clickHandler] Clicked!");
            let battleScene = new BattleScene();
            this.sceneChanger.changeScene(battleScene);
        };
    }

    setup(sceneChanger: SceneChanger): void {
        this.sceneChanger = sceneChanger;
        this.sceneChanger.canvas.addEventListener('click', this.clickHandler, false);
    }

    tearDown(): void {
        this.sceneChanger.canvas.removeEventListener('click', this.clickHandler, false);
    }

    update(timestamp: number): void {
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._draw_back(ctx);
        this._draw_message(ctx);
    }

    private _draw_message(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = MyColor.darkGray;
        ctx.font = '32px sans-serif'
        const msg = "潜水艦の初期配置を入力してOKボタンを押してください";
        ctx.fillText(msg, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    private _draw_back(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = MyColor.lightGray;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}


class BattleScene implements Scene {
    sceneChanger: SceneChanger;

    setup(sceneChanger: SceneChanger): void {
    }

    tearDown(): void {
    }

    update(timestamp: number): void {
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this._draw_back(ctx);
        this._draw_message(ctx);
    }

    private _draw_message(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = MyColor.darkGray;
        ctx.font = '32px sans-serif'
        const msg = "Battle Scene";
        ctx.fillText(msg, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    private _draw_back(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = MyColor.whiteGray;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('main-canvas') as HTMLCanvasElement;
    const titleScene = new TitleScene();
    const visualizer = new Visualizer(canvas, titleScene);
    visualizer.run();
});
