
type Vector = {
    x: number;
    y: number;
};

type StrokeProperties = {
    lineWidth: number;
    strokeStyle: string;
};

type FillProperties = {
    fillStyle: string;
};

type FontProperties = {
    font: string;
};

type NodeView = {
    path: Path2D;
    stroke: StrokeProperties;
    fill: FillProperties;
};

type EdgeView = {
    path: Path2D;
    stroke: StrokeProperties;
};

type NodeLabelView = {
    text: string;
    position: Vector;
    font: FontProperties;
    fill: FillProperties;
};
