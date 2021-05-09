const SaltyUtils =  {

    setAttributes = (_elem, ..._attributes) => {

        attributes.forEach(attrib => {
            if (attrib.length === 2) {
                _elem.setAttribute(attrib[0], attrib[1]);
            }
        });
    }

    
};