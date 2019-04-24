import Vue from 'vue';

export default Vue.extend({
    template: `<div style="width: 100%">
                    <input type="text"
                        v-on:keydown="keyDownChangeHandler"
                        v-on:input="inputChangeHandler"
                        v-if="editEnabled" 
                        style=" width: 100%"> {{innerText}}
                    <span v-if="!editEnabled"
                        style="
                            width:100%;
                            height:100%; 
                            "
                            >
                        {{innerText}}
                    </span>
                </div>`,
    data(params) {
        return {
            editEnabled: editEnabled,
            innerText: '',
        };
    },
    methods: {
        refresh(params) {
            this.params = params;
            this.setInnerText(params);
            return true;
        },
        keyDownChangeHandler(e) {
            // e.stopPropagation();
        },

        setInnerText(params) {
            this.innerText = params.value;
        },

        inputChangeHandler(e) {
            this.params.setValue(e.target.value);
        },
    },
    created() {
        this.setInnerText(this.params);
    },
});
