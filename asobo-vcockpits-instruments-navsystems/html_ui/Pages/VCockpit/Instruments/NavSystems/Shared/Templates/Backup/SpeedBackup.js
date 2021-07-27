class SpeedBackup extends HTMLElement {
    constructor() {
        super();
        this.redBegin = 0;
        this.redEnd = 0;
        this.greenBegin = 0;
        this.greenEnd = 0;
        this.flapsBegin = 0;
        this.flapsEnd = 0;
        this.yellowBegin = 0;
        this.yellowEnd = 0;
        this.minValue = 0;
        this.maxValue = 0;
        this.cursorSizeFactor = 1;
        this.aspectRatio = 1.0;
        this.isBackup = false;
    }
    static get observedAttributes() {
        return [
            "altitude",
            "pressure",
            "airspeed",
            "min-speed",
            "green-begin",
            "green-end",
            "flaps-begin",
            "flaps-end",
            "yellow-begin",
            "yellow-end",
            "red-begin",
            "red-end",
            "max-speed",
            "aspect-ratio",
            "is-backup"
        ];
    }
    connectedCallback() {
        this.construct();
    }
    construct() {
        if (this.hasAttribute("cursorSizeFactor")) {
            this.cursorSizeFactor = parseFloat(this.getAttribute("cursorSizeFactor"));
        }
        var refHeight = 350;
        var refCenter = 175;
        var baroDeltaY = 0;
        if (this.isBackup && this.aspectRatio < 1.0) {
            refHeight = 512;
            refCenter = 250;
            baroDeltaY = -15;
        }
        Utils.RemoveAllChildren(this);
        this.root = document.createElementNS(Avionics.SVG.NS, "svg");
        diffAndSetAttribute(this.root, "width", "100%");
        diffAndSetAttribute(this.root, "height", "100%");
        diffAndSetAttribute(this.root, "viewBox", "0 0 512 " + refHeight);
        this.appendChild(this.root);
        this.baroGroup = document.createElementNS(Avionics.SVG.NS, "g");
        diffAndSetAttribute(this.baroGroup, "transform", "translate(0," + baroDeltaY + ")");
        {
            let baroTitle = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(baroTitle, "x", "256");
            diffAndSetAttribute(baroTitle, "y", "30");
            diffAndSetAttribute(baroTitle, "font-size", "35");
            diffAndSetAttribute(baroTitle, "text-anchor", "middle");
            diffAndSetAttribute(baroTitle, "font-family", "Roboto-Bold");
            diffAndSetAttribute(baroTitle, "fill", "white");
            diffAndSetText(baroTitle, "BARO");
            this.baroGroup.appendChild(baroTitle);
            let baroBg = document.createElementNS(Avionics.SVG.NS, "rect");
            diffAndSetAttribute(baroBg, "x", "190");
            diffAndSetAttribute(baroBg, "y", "40");
            diffAndSetAttribute(baroBg, "width", "132");
            diffAndSetAttribute(baroBg, "height", "40");
            diffAndSetAttribute(baroBg, "fill", "black");
            diffAndSetAttribute(baroBg, "stroke", "white");
            diffAndSetAttribute(baroBg, "stroke-width", "3");
            this.baroGroup.appendChild(baroBg);
            this.baroText = document.createElementNS(Avionics.SVG.NS, "text");
            diffAndSetAttribute(this.baroText, "x", "256");
            diffAndSetAttribute(this.baroText, "y", "70");
            diffAndSetAttribute(this.baroText, "font-size", "35");
            diffAndSetAttribute(this.baroText, "text-anchor", "middle");
            diffAndSetAttribute(this.baroText, "font-family", "Roboto-Bold");
            diffAndSetAttribute(this.baroText, "fill", "white");
            diffAndSetText(this.baroText, "29.99");
            this.baroGroup.appendChild(this.baroText);
        }
        this.root.appendChild(this.baroGroup);
        this.airspeedGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.airspeedGroup);
        {
            this.airspeedCenter = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.airspeedCenter, "x", "0");
            diffAndSetAttribute(this.airspeedCenter, "y", "0");
            diffAndSetAttribute(this.airspeedCenter, "width", "200");
            diffAndSetAttribute(this.airspeedCenter, "height", refHeight + '');
            diffAndSetAttribute(this.airspeedCenter, "viewBox", "0 0 200 " + refHeight);
            this.airspeedGroup.appendChild(this.airspeedCenter);
            {
                this.airspeedCenterGroup = document.createElementNS(Avionics.SVG.NS, "g");
                this.airspeedCenter.appendChild(this.airspeedCenterGroup);
                {
                    this.airspeedGradTexts = [];
                    this.redElement = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.redElement, "x", "0");
                    diffAndSetAttribute(this.redElement, "y", "-1");
                    diffAndSetAttribute(this.redElement, "width", "25");
                    diffAndSetAttribute(this.redElement, "height", "0");
                    diffAndSetAttribute(this.redElement, "fill", "red");
                    this.airspeedCenterGroup.appendChild(this.redElement);
                    this.yellowElement = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.yellowElement, "x", "0");
                    diffAndSetAttribute(this.yellowElement, "y", "-1");
                    diffAndSetAttribute(this.yellowElement, "width", "25");
                    diffAndSetAttribute(this.yellowElement, "height", "0");
                    diffAndSetAttribute(this.yellowElement, "fill", "yellow");
                    this.airspeedCenterGroup.appendChild(this.yellowElement);
                    this.greenElement = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.greenElement, "x", "0");
                    diffAndSetAttribute(this.greenElement, "y", "-1");
                    diffAndSetAttribute(this.greenElement, "width", "25");
                    diffAndSetAttribute(this.greenElement, "height", "0");
                    diffAndSetAttribute(this.greenElement, "fill", "green");
                    this.airspeedCenterGroup.appendChild(this.greenElement);
                    this.flapsElement = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(this.flapsElement, "x", "0");
                    diffAndSetAttribute(this.flapsElement, "y", "-1");
                    diffAndSetAttribute(this.flapsElement, "width", "12.5");
                    diffAndSetAttribute(this.flapsElement, "height", "0");
                    diffAndSetAttribute(this.flapsElement, "fill", "white");
                    this.airspeedCenterGroup.appendChild(this.flapsElement);
                    let dashSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                    diffAndSetAttribute(dashSvg, "id", "DASH");
                    diffAndSetAttribute(dashSvg, "x", "0");
                    diffAndSetAttribute(dashSvg, "y", "0");
                    diffAndSetAttribute(dashSvg, "width", "25");
                    diffAndSetAttribute(dashSvg, "height", refHeight + '');
                    diffAndSetAttribute(dashSvg, "viewBox", "0 0 25 " + refHeight);
                    this.airspeedGroup.appendChild(dashSvg);
                    this.startElement = document.createElementNS(Avionics.SVG.NS, "g");
                    dashSvg.appendChild(this.startElement);
                    let startBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(startBg, "x", "0");
                    diffAndSetAttribute(startBg, "y", "-940");
                    diffAndSetAttribute(startBg, "width", "25");
                    diffAndSetAttribute(startBg, "height", "800");
                    diffAndSetAttribute(startBg, "fill", "white");
                    this.startElement.appendChild(startBg);
                    for (let i = 0; i <= 32; i++) {
                        let redLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(redLine, "x", "0");
                        diffAndSetAttribute(redLine, "y", (-125 - 25 * i) + '');
                        diffAndSetAttribute(redLine, "width", "25");
                        diffAndSetAttribute(redLine, "height", "12.5");
                        diffAndSetAttribute(redLine, "transform", "skewY(-30)");
                        diffAndSetAttribute(redLine, "fill", "red");
                        this.startElement.appendChild(redLine);
                    }
                    this.endElement = document.createElementNS(Avionics.SVG.NS, "g");
                    dashSvg.appendChild(this.endElement);
                    let endBg = document.createElementNS(Avionics.SVG.NS, "rect");
                    diffAndSetAttribute(endBg, "x", "0");
                    diffAndSetAttribute(endBg, "y", "-900");
                    diffAndSetAttribute(endBg, "width", "25");
                    diffAndSetAttribute(endBg, "height", "800");
                    diffAndSetAttribute(endBg, "fill", "white");
                    this.endElement.appendChild(endBg);
                    for (let i = 0; i <= 32; i++) {
                        let redLine = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(redLine, "x", "0");
                        diffAndSetAttribute(redLine, "y", (-125 - 25 * i) + '');
                        diffAndSetAttribute(redLine, "width", "25");
                        diffAndSetAttribute(redLine, "height", "12.5");
                        diffAndSetAttribute(redLine, "transform", "skewY(-30)");
                        diffAndSetAttribute(redLine, "fill", "red");
                        this.endElement.appendChild(redLine);
                    }
                    var center = refCenter;
                    for (let i = -3; i <= 5; i++) {
                        let grad = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(grad, "x", "0");
                        diffAndSetAttribute(grad, "y", (center + 80 * i) + '');
                        diffAndSetAttribute(grad, "height", "4");
                        diffAndSetAttribute(grad, "width", "50");
                        diffAndSetAttribute(grad, "fill", "white");
                        this.airspeedCenterGroup.appendChild(grad);
                        if (i != 0) {
                            let halfGrad = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(halfGrad, "x", "0");
                            diffAndSetAttribute(halfGrad, "y", (center + 80 * i + (i < 0 ? 40 : -40)) + '');
                            diffAndSetAttribute(halfGrad, "height", "4");
                            diffAndSetAttribute(halfGrad, "width", "25");
                            diffAndSetAttribute(halfGrad, "fill", "white");
                            this.airspeedCenterGroup.appendChild(halfGrad);
                        }
                        let gradText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(gradText, "x", "55");
                        diffAndSetAttribute(gradText, "y", (center + 10 + 80 * i) + '');
                        diffAndSetAttribute(gradText, "fill", "white");
                        diffAndSetAttribute(gradText, "font-size", "30");
                        diffAndSetAttribute(gradText, "font-family", "Roboto-Bold");
                        diffAndSetText(gradText, "XXX");
                        this.airspeedGradTexts.push(gradText);
                        this.airspeedCenterGroup.appendChild(gradText);
                    }
                }
                this.airspeedCursor = document.createElementNS(Avionics.SVG.NS, "polygon");
                diffAndSetAttribute(this.airspeedCursor, "points", 200 * this.cursorSizeFactor + "," + (center - 40 * this.cursorSizeFactor) + " " +
                    180 * this.cursorSizeFactor + "," + (center - 40 * this.cursorSizeFactor) + " " +
                    180 * this.cursorSizeFactor + "," + (center - 60 * this.cursorSizeFactor) + " " +
                    130 * this.cursorSizeFactor + "," + (center - 60 * this.cursorSizeFactor) + " " +
                    130 * this.cursorSizeFactor + "," + (center - 40 * this.cursorSizeFactor) + " " +
                    35 * this.cursorSizeFactor + "," + (center - 40 * this.cursorSizeFactor) + " " +
                    "5," + center + " " +
                    35 * this.cursorSizeFactor + "," + (center + 40 * this.cursorSizeFactor) + " " +
                    130 * this.cursorSizeFactor + "," + (center + 40 * this.cursorSizeFactor) + " " +
                    130 * this.cursorSizeFactor + "," + (center + 60 * this.cursorSizeFactor) + " " +
                    180 * this.cursorSizeFactor + "," + (center + 60 * this.cursorSizeFactor) + " " +
                    180 * this.cursorSizeFactor + "," + (center + 40 * this.cursorSizeFactor) + " " +
                    200 * this.cursorSizeFactor + "," + (center + 40 * this.cursorSizeFactor));
                diffAndSetAttribute(this.airspeedCursor, "stroke", "white");
                diffAndSetAttribute(this.airspeedCursor, "stroke-width", "3");
                diffAndSetAttribute(this.airspeedCursor, "fill", "black");
                this.airspeedGroup.appendChild(this.airspeedCursor);
                let baseCursorSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(baseCursorSvg, "x", (30 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(baseCursorSvg, "y", (center - 40 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(baseCursorSvg, "width", (100 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(baseCursorSvg, "height", (80 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(baseCursorSvg, "viewBox", "0 0 " + (100 * this.cursorSizeFactor) + " " + (80 * this.cursorSizeFactor));
                this.airspeedGroup.appendChild(baseCursorSvg);
                {
                    this.airspeedDigit1Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.airspeedDigit1Top, "x", (28 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit1Top, "y", "-1");
                    diffAndSetAttribute(this.airspeedDigit1Top, "fill", "white");
                    diffAndSetAttribute(this.airspeedDigit1Top, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit1Top, "font-family", "Roboto-Bold");
                    diffAndSetText(this.airspeedDigit1Top, "-");
                    baseCursorSvg.appendChild(this.airspeedDigit1Top);
                    this.airspeedDigit1Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.airspeedDigit1Bot, "x", (28 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit1Bot, "y", (55 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit1Bot, "fill", "white");
                    diffAndSetAttribute(this.airspeedDigit1Bot, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit1Bot, "font-family", "Roboto-Bold");
                    diffAndSetText(this.airspeedDigit1Bot, "-");
                    baseCursorSvg.appendChild(this.airspeedDigit1Bot);
                    this.airspeedDigit2Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.airspeedDigit2Top, "x", (70 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit2Top, "y", "-1");
                    diffAndSetAttribute(this.airspeedDigit2Top, "fill", "white");
                    diffAndSetAttribute(this.airspeedDigit2Top, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit2Top, "font-family", "Roboto-Bold");
                    diffAndSetText(this.airspeedDigit2Top, "-");
                    baseCursorSvg.appendChild(this.airspeedDigit2Top);
                    this.airspeedDigit2Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.airspeedDigit2Bot, "x", (70 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit2Bot, "y", (55 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit2Bot, "fill", "white");
                    diffAndSetAttribute(this.airspeedDigit2Bot, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.airspeedDigit2Bot, "font-family", "Roboto-Bold");
                    diffAndSetText(this.airspeedDigit2Bot, "-");
                    baseCursorSvg.appendChild(this.airspeedDigit2Bot);
                }
                let rotatingCursorSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(rotatingCursorSvg, "x", (130 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(rotatingCursorSvg, "y", (center - 60 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(rotatingCursorSvg, "width", (70 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(rotatingCursorSvg, "height", (120 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(rotatingCursorSvg, "viewBox", "0 " + (-60 * this.cursorSizeFactor) + " " + (50 * this.cursorSizeFactor) + " " + (120 * this.cursorSizeFactor));
                this.airspeedGroup.appendChild(rotatingCursorSvg);
                {
                    this.airspeedEndDigitsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    rotatingCursorSvg.appendChild(this.airspeedEndDigitsGroup);
                    this.airspeedEndDigits = [];
                    for (let i = -2; i <= 2; i++) {
                        let digit = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(digit, "x", "0");
                        diffAndSetAttribute(digit, "y", ((15 + 45 * i) * this.cursorSizeFactor) + '');
                        diffAndSetAttribute(digit, "fill", "white");
                        diffAndSetAttribute(digit, "font-size", (50 * this.cursorSizeFactor) + '');
                        diffAndSetAttribute(digit, "font-family", "Roboto-Bold");
                        diffAndSetText(digit, i == 0 ? "-" : " ");
                        this.airspeedEndDigits.push(digit);
                        this.airspeedEndDigitsGroup.appendChild(digit);
                    }
                }
            }
        }
        this.altimeterGroup = document.createElementNS(Avionics.SVG.NS, "g");
        this.root.appendChild(this.altimeterGroup);
        {
            this.altimeterCenter = document.createElementNS(Avionics.SVG.NS, "svg");
            diffAndSetAttribute(this.altimeterCenter, "x", "312");
            diffAndSetAttribute(this.altimeterCenter, "y", "0");
            diffAndSetAttribute(this.altimeterCenter, "width", "200");
            diffAndSetAttribute(this.altimeterCenter, "height", refHeight + '');
            diffAndSetAttribute(this.altimeterCenter, "viewBox", "0 0 200 " + refHeight);
            this.altimeterGroup.appendChild(this.altimeterCenter);
            {
                let graduationSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(graduationSvg, "x", "0");
                diffAndSetAttribute(graduationSvg, "y", "0");
                diffAndSetAttribute(graduationSvg, "width", "200");
                diffAndSetAttribute(graduationSvg, "height", refHeight + '');
                diffAndSetAttribute(graduationSvg, "viewBox", "0 0 200 " + refHeight);
                this.altimeterCenter.appendChild(graduationSvg);
                let center = refCenter;
                this.altimeterGraduationGroup = document.createElementNS(Avionics.SVG.NS, "g");
                graduationSvg.appendChild(this.altimeterGraduationGroup);
                {
                    let graduationSize = 60;
                    this.altimeterGraduationTexts = [];
                    for (let i = -5; i <= 5; i++) {
                        let mainGrad = document.createElementNS(Avionics.SVG.NS, "rect");
                        diffAndSetAttribute(mainGrad, "x", "160");
                        diffAndSetAttribute(mainGrad, "y", fastToFixed(center - 2 + i * graduationSize, 0));
                        diffAndSetAttribute(mainGrad, "height", "4");
                        diffAndSetAttribute(mainGrad, "width", "40");
                        diffAndSetAttribute(mainGrad, "fill", "white");
                        this.altimeterGraduationGroup.appendChild(mainGrad);
                        let gradText = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(gradText, "x", "155");
                        diffAndSetAttribute(gradText, "y", fastToFixed(center + 8 + i * graduationSize, 0));
                        diffAndSetAttribute(gradText, "fill", "white");
                        diffAndSetAttribute(gradText, "font-size", "30");
                        diffAndSetAttribute(gradText, "font-family", "Roboto-Bold");
                        diffAndSetAttribute(gradText, "text-anchor", "end");
                        diffAndSetText(gradText, "XXXX");
                        this.altimeterGraduationGroup.appendChild(gradText);
                        this.altimeterGraduationTexts.push(gradText);
                        for (let j = 1; j < 5; j++) {
                            let grad = document.createElementNS(Avionics.SVG.NS, "rect");
                            diffAndSetAttribute(grad, "x", "185");
                            diffAndSetAttribute(grad, "y", fastToFixed(center - 2 + i * graduationSize + j * (graduationSize / 5), 0));
                            diffAndSetAttribute(grad, "height", "4");
                            diffAndSetAttribute(grad, "width", "15");
                            diffAndSetAttribute(grad, "fill", "white");
                            this.altimeterGraduationGroup.appendChild(grad);
                        }
                    }
                }
                let cursor = document.createElementNS(Avionics.SVG.NS, "path");
                diffAndSetAttribute(cursor, "d", "M" + (200 - (200 * this.cursorSizeFactor)) + " " + (center - (40 * this.cursorSizeFactor)) +
                    " L" + (200 - (100 * this.cursorSizeFactor)) + " " + (center - (40 * this.cursorSizeFactor)) +
                    " L" + (200 - (100 * this.cursorSizeFactor)) + " " + (center - (60 * this.cursorSizeFactor)) +
                    " L" + (200 - (35 * this.cursorSizeFactor)) + " " + (center - (60 * this.cursorSizeFactor)) +
                    " L" + (200 - (35 * this.cursorSizeFactor)) + " " + (center - (40 * this.cursorSizeFactor)) +
                    " L" + 195 + " " + center +
                    " L" + (200 - (35 * this.cursorSizeFactor)) + " " + (center + (40 * this.cursorSizeFactor)) +
                    " L" + (200 - (35 * this.cursorSizeFactor)) + " " + (center + (60 * this.cursorSizeFactor)) +
                    " L" + (200 - (100 * this.cursorSizeFactor)) + " " + (center + (60 * this.cursorSizeFactor)) +
                    " L" + (200 - (100 * this.cursorSizeFactor)) + " " + (center + (40 * this.cursorSizeFactor)) +
                    " L" + (200 - (200 * this.cursorSizeFactor)) + " " + (center + (40 * this.cursorSizeFactor)) + "Z");
                diffAndSetAttribute(cursor, "fill", "black");
                diffAndSetAttribute(cursor, "stroke", "white");
                diffAndSetAttribute(cursor, "stroke-width", "3");
                graduationSvg.appendChild(cursor);
                let cursorBaseSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(cursorBaseSvg, "x", (200 - (200 * this.cursorSizeFactor)) + '');
                diffAndSetAttribute(cursorBaseSvg, "y", (center - (40 * this.cursorSizeFactor)) + '');
                diffAndSetAttribute(cursorBaseSvg, "width", (100 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(cursorBaseSvg, "height", (80 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(cursorBaseSvg, "viewBox", "0 0 " + (100 * this.cursorSizeFactor) + " " + (80 * this.cursorSizeFactor));
                graduationSvg.appendChild(cursorBaseSvg);
                {
                    this.altimeterDigit1Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit1Top, "x", (16 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit1Top, "y", "-1");
                    diffAndSetAttribute(this.altimeterDigit1Top, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit1Top, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit1Top, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit1Top, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit1Top);
                    this.altimeterDigit1Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit1Bot, "x", (16 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit1Bot, "y", (57 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit1Bot, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit1Bot, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit1Bot, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit1Bot, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit1Bot);
                    this.altimeterDigit2Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit2Top, "x", (44 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit2Top, "y", "-1");
                    diffAndSetAttribute(this.altimeterDigit2Top, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit2Top, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit2Top, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit2Top, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit2Top);
                    this.altimeterDigit2Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit2Bot, "x", (44 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit2Bot, "y", (57 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit2Bot, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit2Bot, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit2Bot, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit2Bot, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit2Bot);
                    this.altimeterDigit3Top = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit3Top, "x", (72 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit3Top, "y", "-1");
                    diffAndSetAttribute(this.altimeterDigit3Top, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit3Top, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit3Top, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit3Top, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit3Top);
                    this.altimeterDigit3Bot = document.createElementNS(Avionics.SVG.NS, "text");
                    diffAndSetAttribute(this.altimeterDigit3Bot, "x", (72 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit3Bot, "y", (57 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit3Bot, "fill", "white");
                    diffAndSetAttribute(this.altimeterDigit3Bot, "font-size", (50 * this.cursorSizeFactor) + '');
                    diffAndSetAttribute(this.altimeterDigit3Bot, "font-family", "Roboto-Bold");
                    diffAndSetText(this.altimeterDigit3Bot, "X");
                    cursorBaseSvg.appendChild(this.altimeterDigit3Bot);
                }
                let cursorRotatingSvg = document.createElementNS(Avionics.SVG.NS, "svg");
                diffAndSetAttribute(cursorRotatingSvg, "x", (200 - 105 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(cursorRotatingSvg, "y", (center - (60 * this.cursorSizeFactor)) + '');
                diffAndSetAttribute(cursorRotatingSvg, "width", (70 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(cursorRotatingSvg, "height", (120 * this.cursorSizeFactor) + '');
                diffAndSetAttribute(cursorRotatingSvg, "viewBox", "0 " + (-50 * this.cursorSizeFactor) + " " + (70 * this.cursorSizeFactor) + " " + (120 * this.cursorSizeFactor));
                graduationSvg.appendChild(cursorRotatingSvg);
                {
                    this.altimeterEndDigitsGroup = document.createElementNS(Avionics.SVG.NS, "g");
                    cursorRotatingSvg.appendChild(this.altimeterEndDigitsGroup);
                    this.altimeterEndDigits = [];
                    for (let i = -2; i <= 2; i++) {
                        let digit = document.createElementNS(Avionics.SVG.NS, "text");
                        diffAndSetAttribute(digit, "x", (7 * this.cursorSizeFactor) + '');
                        diffAndSetAttribute(digit, "y", ((27 + 45 * i) * this.cursorSizeFactor) + '');
                        diffAndSetAttribute(digit, "fill", "white");
                        diffAndSetAttribute(digit, "font-size", (50 * this.cursorSizeFactor) + '');
                        diffAndSetAttribute(digit, "font-family", "Roboto-Bold");
                        diffAndSetText(digit, "XX");
                        this.altimeterEndDigits.push(digit);
                        this.altimeterEndDigitsGroup.appendChild(digit);
                    }
                }
            }
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue == newValue)
            return;
        switch (name) {
            case "is-backup":
                {
                    this.isBackup = newValue == "true";
                    break;
                }
            case "aspect-ratio":
                {
                    this.aspectRatio = parseFloat(newValue);
                    this.construct();
                    break;
                }
            case "altitude":
                {
                    let value = parseFloat(newValue);
                    this.altitude = value;
                    let center = Math.round(value / 100) * 100;
                    diffAndSetAttribute(this.altimeterGraduationGroup, "transform", "translate(0, " + ((value - center) * 60 / 100) + ")");
                    if (this.currentCenterGrad != center) {
                        this.currentCenterGrad = center;
                        for (let i = 0; i < this.altimeterGraduationTexts.length; i++) {
                            diffAndSetText(this.altimeterGraduationTexts[i], fastToFixed(((5 - i) * 100) + center, 0));
                        }
                    }
                    let endValue = value % 100;
                    let endCenter = Math.round(endValue / 10) * 10;
                    diffAndSetAttribute(this.altimeterEndDigitsGroup, "transform", "translate(0, " + ((endValue - endCenter) * 45 * this.cursorSizeFactor / 10) + ")");
                    for (let i = 0; i < this.altimeterEndDigits.length; i++) {
                        let digitValue = Math.round((((2 - i) * 10) + value) % 100 / 10) * 10;
                        diffAndSetText(this.altimeterEndDigits[i], fastToFixed(Math.abs((digitValue % 100) / 10), 0) + "0");
                    }
                    if (Math.abs(value) >= 90) {
                        let d3Value = (Math.abs(value) % 1000) / 100;
                        diffAndSetText(this.altimeterDigit3Bot, Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0));
                        diffAndSetText(this.altimeterDigit3Top, fastToFixed((Math.floor(d3Value) + 1) % 10, 0));
                        if (endValue > 90 || endValue < -90) {
                            if (endValue < 0) {
                                diffAndSetText(this.altimeterDigit3Bot, fastToFixed((Math.floor(d3Value) + 1) % 10, 0));
                                diffAndSetText(this.altimeterDigit3Top, Math.abs(value) < 100 ? "" : fastToFixed(Math.floor(d3Value), 0));
                            }
                            let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 57 * this.cursorSizeFactor / 10;
                            diffAndSetAttribute(this.altimeterDigit3Bot, "transform", "translate(0, " + translate + ")");
                            diffAndSetAttribute(this.altimeterDigit3Top, "transform", "translate(0, " + translate + ")");
                        }
                        else {
                            diffAndSetAttribute(this.altimeterDigit3Bot, "transform", "");
                            diffAndSetAttribute(this.altimeterDigit3Top, "transform", "");
                        }
                        if (Math.abs(value) >= 990) {
                            let d2Value = (Math.abs(value) % 10000) / 1000;
                            diffAndSetText(this.altimeterDigit2Bot, Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                            diffAndSetText(this.altimeterDigit2Top, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                            if ((endValue > 90 || endValue < -90) && d3Value > 9) {
                                if (endValue < 0) {
                                    diffAndSetText(this.altimeterDigit2Bot, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                                    diffAndSetText(this.altimeterDigit2Top, Math.abs(value) < 1000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                                }
                                let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 57 * this.cursorSizeFactor / 10;
                                diffAndSetAttribute(this.altimeterDigit2Bot, "transform", "translate(0, " + translate + ")");
                                diffAndSetAttribute(this.altimeterDigit2Top, "transform", "translate(0, " + translate + ")");
                            }
                            else {
                                diffAndSetAttribute(this.altimeterDigit2Bot, "transform", "");
                                diffAndSetAttribute(this.altimeterDigit2Top, "transform", "");
                            }
                            if (Math.abs(value) >= 9990) {
                                let d1Value = (Math.abs(value) % 100000) / 10000;
                                diffAndSetText(this.altimeterDigit1Bot, Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d1Value), 0));
                                diffAndSetText(this.altimeterDigit1Top, fastToFixed((Math.floor(d1Value) + 1) % 10, 0));
                                if ((endValue > 90 || endValue < -90) && d3Value > 9 && d2Value > 9) {
                                    if (endValue < 0) {
                                        diffAndSetText(this.altimeterDigit1Bot, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                                        diffAndSetText(this.altimeterDigit1Top, Math.abs(value) < 10000 ? "" : fastToFixed(Math.floor(d2Value), 0));
                                    }
                                    let translate = (endValue > 0 ? (endValue - 90) : (endValue + 100)) * 57 * this.cursorSizeFactor / 10;
                                    diffAndSetAttribute(this.altimeterDigit1Bot, "transform", "translate(0, " + translate + ")");
                                    diffAndSetAttribute(this.altimeterDigit1Top, "transform", "translate(0, " + translate + ")");
                                }
                                else {
                                    diffAndSetAttribute(this.altimeterDigit1Bot, "transform", "");
                                    diffAndSetAttribute(this.altimeterDigit1Top, "transform", "");
                                }
                            }
                            else {
                                diffAndSetAttribute(this.altimeterDigit1Bot, "transform", "");
                                diffAndSetAttribute(this.altimeterDigit1Top, "transform", "");
                                if (value < 0) {
                                    diffAndSetText(this.altimeterDigit1Bot, "-");
                                }
                                else {
                                    diffAndSetText(this.altimeterDigit1Bot, "");
                                }
                                diffAndSetText(this.altimeterDigit1Top, "");
                            }
                        }
                        else {
                            diffAndSetAttribute(this.altimeterDigit2Bot, "transform", "");
                            diffAndSetAttribute(this.altimeterDigit2Top, "transform", "");
                            if (value < 0) {
                                diffAndSetText(this.altimeterDigit2Bot, "-");
                            }
                            else {
                                diffAndSetText(this.altimeterDigit2Bot, "");
                            }
                            diffAndSetText(this.altimeterDigit1Bot, "");
                            diffAndSetText(this.altimeterDigit1Top, "");
                            diffAndSetText(this.altimeterDigit2Top, "");
                        }
                    }
                    else {
                        if (value < 0) {
                            diffAndSetText(this.altimeterDigit3Bot, "-");
                        }
                        else {
                            diffAndSetText(this.altimeterDigit3Bot, "");
                        }
                        diffAndSetText(this.altimeterDigit2Bot, "");
                        diffAndSetText(this.altimeterDigit1Bot, "");
                        diffAndSetText(this.altimeterDigit2Top, "");
                        diffAndSetText(this.altimeterDigit1Top, "");
                        diffAndSetAttribute(this.altimeterDigit3Bot, "transform", "");
                        diffAndSetAttribute(this.altimeterDigit3Top, "transform", "");
                    }
                }
                break;
            case "pressure":
                diffAndSetText(this.baroText, fastToFixed(parseFloat(newValue), 2));
                break;
            case "airspeed":
                {
                    this.airspeed = Math.max(parseFloat(newValue), 20);
                    let center = Math.max(Math.round(this.airspeed / 10) * 10, 50);
                    if (((this.minValue > 0) && (this.airspeed < this.minValue)) || ((this.maxValue > 0) && (this.airspeed > this.maxValue))) {
                        diffAndSetAttribute(this.airspeedCursor, "fill", "red");
                    }
                    else {
                        diffAndSetAttribute(this.airspeedCursor, "fill", "black");
                    }
                    diffAndSetAttribute(this.airspeedCenterGroup, "transform", "translate(0, " + ((this.airspeed - center) * 8) + ")");
                    if (this.minValue > 0) {
                        var val = 708 + ((center + 40 - this.minValue) * 10) + ((this.airspeed - center) * 10);
                        diffAndSetAttribute(this.startElement, "transform", "translate(0," + val + ")");
                    }
                    if (this.maxValue > 0) {
                        var val = 275 + ((center - this.maxValue) * 8) + ((this.airspeed - center) * 8);
                        diffAndSetAttribute(this.endElement, "transform", "translate(0," + val + ")");
                    }
                    if (this.airspeedCurrentCenterGrad != center) {
                        this.airspeedCurrentCenterGrad = center;
                        for (let i = 0; i < this.airspeedGradTexts.length; i++) {
                            diffAndSetText(this.airspeedGradTexts[i], fastToFixed(((3 - i) * 10) + center, 0));
                        }
                        let greenEnd = Math.min(Math.max(-300, (175 + (-8 * (this.greenEnd - center)))), 800);
                        let greenBegin = Math.min(Math.max(-300, (175 + (-8 * (this.greenBegin - center)))), 800);
                        diffAndSetAttribute(this.greenElement, "y", greenEnd + '');
                        diffAndSetAttribute(this.greenElement, "height", (greenBegin - greenEnd) + '');
                        let yellowEnd = Math.min(Math.max(-300, (175 + (-8 * (this.yellowEnd - center)))), 800);
                        let yellowBegin = Math.min(Math.max(-300, (175 + (-8 * (this.yellowBegin - center)))), 800);
                        diffAndSetAttribute(this.yellowElement, "y", yellowEnd + '');
                        diffAndSetAttribute(this.yellowElement, "height", (yellowBegin - yellowEnd) + '');
                        let redEnd = Math.min(Math.max(-300, (175 + (-8 * (this.redEnd - center)))), 800);
                        let redBegin = Math.min(Math.max(-300, (175 + (-8 * (this.redBegin - center)))), 800);
                        diffAndSetAttribute(this.redElement, "y", redEnd + '');
                        diffAndSetAttribute(this.redElement, "height", (redBegin - redEnd) + '');
                        let flapsEnd = Math.min(Math.max(-300, (175 + (-8 * (this.flapsEnd - center)))), 800);
                        let flapsBegin = Math.min(Math.max(-300, (175 + (-8 * (this.flapsBegin - center)))), 800);
                        diffAndSetAttribute(this.flapsElement, "y", flapsEnd + '');
                        diffAndSetAttribute(this.flapsElement, "height", (flapsBegin - flapsEnd) + '');
                    }
                    let endValue = this.airspeed % 10;
                    let endCenter = Math.round(endValue);
                    diffAndSetAttribute(this.airspeedEndDigitsGroup, "transform", "translate(0, " + ((endValue - endCenter) * 45) * this.cursorSizeFactor + ")");
                    for (let i = 0; i < this.airspeedEndDigits.length; i++) {
                        if (this.airspeed == 20) {
                            diffAndSetText(this.airspeedEndDigits[i], (i == 2 ? "-" : " "));
                        }
                        else {
                            let digitValue = (2 - i + endCenter);
                            diffAndSetText(this.airspeedEndDigits[i], fastToFixed((10 + digitValue) % 10, 0));
                        }
                    }
                    if (this.airspeed > 20) {
                        let d2Value = (Math.abs(this.airspeed) % 100) / 10;
                        diffAndSetText(this.airspeedDigit2Bot, fastToFixed(Math.floor(d2Value), 0));
                        diffAndSetText(this.airspeedDigit2Top, fastToFixed((Math.floor(d2Value) + 1) % 10, 0));
                        if (endValue > 9) {
                            let translate = (endValue - 9) * 55 * this.cursorSizeFactor;
                            diffAndSetAttribute(this.airspeedDigit2Bot, "transform", "translate(0, " + translate + ")");
                            diffAndSetAttribute(this.airspeedDigit2Top, "transform", "translate(0, " + translate + ")");
                        }
                        else {
                            diffAndSetAttribute(this.airspeedDigit2Bot, "transform", "");
                            diffAndSetAttribute(this.airspeedDigit2Top, "transform", "");
                        }
                        if (Math.abs(this.airspeed) >= 99) {
                            let d1Value = (Math.abs(this.airspeed) % 1000) / 100;
                            diffAndSetText(this.airspeedDigit1Bot, Math.abs(this.airspeed) < 100 ? "" : fastToFixed(Math.floor(d1Value), 0));
                            diffAndSetText(this.airspeedDigit1Top, fastToFixed((Math.floor(d1Value) + 1) % 10, 0));
                            if (endValue > 9 && d2Value > 9) {
                                let translate = (endValue - 9) * 55 * this.cursorSizeFactor;
                                diffAndSetAttribute(this.airspeedDigit1Bot, "transform", "translate(0, " + translate + ")");
                                diffAndSetAttribute(this.airspeedDigit1Top, "transform", "translate(0, " + translate + ")");
                            }
                            else {
                                diffAndSetAttribute(this.airspeedDigit1Bot, "transform", "");
                                diffAndSetAttribute(this.airspeedDigit1Top, "transform", "");
                            }
                        }
                        else {
                            diffAndSetText(this.airspeedDigit1Bot, "");
                            diffAndSetText(this.airspeedDigit1Top, "");
                        }
                    }
                    else {
                        diffAndSetText(this.airspeedDigit2Bot, "-");
                        diffAndSetText(this.airspeedDigit1Bot, "-");
                        diffAndSetAttribute(this.airspeedDigit1Bot, "transform", "");
                        diffAndSetAttribute(this.airspeedDigit1Top, "transform", "");
                        diffAndSetAttribute(this.airspeedDigit2Bot, "transform", "");
                        diffAndSetAttribute(this.airspeedDigit2Top, "transform", "");
                    }
                }
                break;
            case "min-speed":
                this.minValue = parseFloat(newValue);
                break;
            case "green-begin":
                this.greenBegin = parseFloat(newValue);
                break;
            case "green-end":
                this.greenEnd = parseFloat(newValue);
                break;
            case "yellow-begin":
                this.yellowBegin = parseFloat(newValue);
                break;
            case "yellow-end":
                this.yellowEnd = parseFloat(newValue);
                break;
            case "flaps-begin":
                this.flapsBegin = parseFloat(newValue);
                break;
            case "flaps-end":
                this.flapsEnd = parseFloat(newValue);
                break;
            case "red-begin":
                this.redBegin = parseFloat(newValue);
                break;
            case "red-end":
                this.redEnd = parseFloat(newValue);
                break;
            case "max-speed":
                this.maxValue = parseFloat(newValue);
                break;
        }
    }
}
customElements.define('speed-backup', SpeedBackup);
//# sourceMappingURL=SpeedBackup.js.map