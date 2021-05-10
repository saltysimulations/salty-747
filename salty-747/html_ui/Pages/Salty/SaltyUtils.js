const SaltyUtils =  {

    setAttributes : (_elem, _attributes) => {
        for (const attr in _attributes) {
            _elem.setAttribute(attr, _attributes[attr]);
        }
    }

};