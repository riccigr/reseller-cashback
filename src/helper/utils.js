const util = {
    cleanupString: (value) => {
        return String(value).replace('.','').replace('-','');
    },

    adjustDecimal: (value) => {
        return Number(value) / 100;
    },
}

module.exports = { util };