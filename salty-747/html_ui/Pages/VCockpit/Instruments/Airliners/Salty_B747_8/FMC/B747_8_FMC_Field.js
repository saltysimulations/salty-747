class FMC_Field {
    constructor(fmc, selectedCallback) {
        this.fmc = fmc;
        this.selectedCallback = selectedCallback;
        this.currentValue = null;
    }
    setOptions(options) {
        for (const option in options) {
            this[option] = options[option];
        }
    }

    getValue() {
        return "";
    }

    /**
     * @param {string|number|null} value
     */
    onSelect(value) {
        this.selectedCallback(this.currentValue);
    }
}

/**
 * @description Placeholder field that shows "NOT YET IMPLEMENTED" message when selected
 */
class FMC_InopField extends FMC_Field {
    /**
     * @param {747_FMC_MainDisplay} fmc
     * @param {string} value
     * @param {boolean} [inopColor=true] whether to append "[color]inop" to the value
     */
    constructor(fmc, value, inopColor = true) {
        super(fmc, () => {});
        this.value = inopColor ? `${value}[color]inop` : value;
    }
    getValue() {
        return this.value;
    }

    onSelect() {
        this.fmc.addNewMessage(SaltyFictionalMessages.notYetImplemented);
        super.onSelect();
    }

}

class FMC_SingleValueField extends FMC_Field {
    /**
     * @param {747_FMC_MainDisplay} fmc
     * @param {"string"|"int"|"number"} type
     * @param {string|number|null} value
     * @param {object} options
     * @param {boolean} [options.clearable=false]
     * @param {string} [options.emptyValue=""]
     * @param {number} [options.maxLength=Infinity]
     * @param {number} [options.minValue=-Infinity]
     * @param {number} [options.maxValue=Infinity]
     * @param {number} [options.maxDisplayedDecimalPlaces=]
     * @param {string} [options.prefix=""]
     * @param {string} [options.suffix=""]
     * @param {function} [options.isValid=]
     * @param {function(*=): void} selectedCallback
     */
    constructor(fmc, type, value, options, selectedCallback) {
        super(fmc, selectedCallback);
        this.type = type;
        this.currentValue = value;
        this.clearable = false;
        this.emptyValue = "";
        this.maxLength = Infinity;
        this.minValue = -Infinity;
        this.maxValue = Infinity;
        this.prefix = "";
        this.suffix = "";
        this.setOptions(options);
    }

    /**
     * @returns {string}
     */
    getValue() {
        let value = this.currentValue;
        if (value === "" || value == null) {
            return this.emptyValue;
        }
        if (this.type === "number" && isFinite(this.maxDisplayedDecimalPlaces)) {
            value = value.toFixed(this.maxDisplayedDecimalPlaces);
        }
        return `${this.prefix}${value}${this.suffix}`;
    }

    /**
     * @param {*} value
     */
    setValue(value) {
        // Custom isValid callback
        if (value.length === 0 || (this.isValid && !this.isValid(value))) {
            this.fmc.addNewMessage(SaltySystemMessages.formatError);
            return false;
        }

        switch (this.type) {
            case "string":
                // Check max length
                if (value.length > this.maxLength) {
                    this.fmc.addNewMessage(SaltySystemMessages.formatError);
                    return;
                }
                break;
            case "int":
                // Make sure value is an integer and is within the min/max
                const valueAsInt = Number.parseInt(value, 10);
                if (!isFinite(valueAsInt) || value.includes(".")) {
                    this.fmc.addNewMessage(SaltySystemMessages.formatError);
                    return;
                }
                if (valueAsInt > this.maxValue || valueAsInt < this.minValue) {
                    this.fmc.addNewMessage(SaltySystemMessages.entryOutOfRange);
                    return;
                }
                value = valueAsInt;
                break;
            case "number":
                // Make sure value is a valid number and is within the min/max
                const valueAsFloat = Number.parseFloat(value);
                if (!isFinite(valueAsFloat)) {
                    this.fmc.addNewMessage(SaltySystemMessages.formatError);
                    return;
                }
                if (valueAsFloat > this.maxValue || valueAsFloat < this.minValue) {
                    this.fmc.addNewMessage(SaltySystemMessages.entryOutOfRange);
                    return;
                }
                value = valueAsFloat;
                break;
        }
        // Update the value
        this.currentValue = value;
    }
    clearValue() {
        if (this.clearable) {
            if (this.type === "string") {
                this.currentValue = "";
            } else {
                this.currentValue = null;
            }
        } else {
            this.fmc.addNewMessage(SaltySystemMessages.notAllowed);
        }
    }
    onSelect(value) {
        if (value === FMCMainDisplay.clrValue) {
            this.clearValue();
        } else {
            this.setValue(value);
        }
        super.onSelect();
    }
}

// TODO: Create classes for multi value fields
