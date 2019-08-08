import attributeBuilder from './buffers/attributeBuilder';
import glScaleBase from './scale/glScaleBase';
import programBuilder from './program/programBuilder';

export default () => {
    let data = null;
    let context = null;
    let changed = false;
    let program = programBuilder();
    let xScale = glScaleBase();
    let yScale = glScaleBase();
    let decorate = () => {};

    const firstDraw = () => {
        program.buffers().attribute('aVertexPosition', attributeBuilder(data));

        context.enable(context.BLEND);
        context.blendFuncSeparate(context.SRC_ALPHA, context.ONE_MINUS_SRC_ALPHA, context.ONE, context.ONE_MINUS_SRC_ALPHA);

        program(context);
        drawFn = redraw;
    };

    const redraw = () => {
        if (changed) {
            program.buffers().attribute('aVertexPosition').data(data);
        }

        program(context);
    };

    let drawFn = firstDraw;
    const draw = () => {
        context.viewport(0, 0, context.canvas.width, context.canvas.height);
        program.apply(xScale);
        program.apply(yScale);
        decorate();
        drawFn();
    };

    draw.data = (...args) => {
        if (!args.length) {
            return data;
        }
        data = args[0];
        changed = true;
        return draw;
    };

    draw.decorate = (...args) => {
        if (!args.length) {
            return decorate;
        }
        decorate = args[0];
        return draw;
    };

    draw.program = (...args) => {
        if (!args.length) {
            return program;
        }
        program = args[0];
        return draw;
    };

    draw.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return draw;
    };

    draw.xScale = (...args) => {
        if (!args.length) {
            return xScale;
        }
        xScale = args[0];
        return xScale;
    };

    draw.yScale = (...args) => {
        if (!args.length) {
            return yScale;
        }
        yScale = args[0];
        return yScale;
    };

    return draw;
};