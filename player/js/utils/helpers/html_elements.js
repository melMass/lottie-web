function createTag(type) {
    if (typeof document === "undefined") {
        return;
    }
    // return {appendChild:function(){},setAttribute:function(){},style:{}}
    return document.createElement(type);
}

export default createTag;
