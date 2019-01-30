import Vue from "vue";

export default Vue.extend({
    template: `
        <div>
            <button v-on:click="randomAge()">
                Randomise
            </button>
            {{this.value}}
        </div>
    `,
    data: function () {
        return {
            value: null
        };
    },
    beforeMount() {
    },
    mounted() {
        console.log('mounted')
        this.value = this.params.value;
    },
    methods: {
        randomAge() {
            var newValue = 13 + Math.floor(Math.random() * 15);
            this.params.setValue(newValue);
            // updates UI but doesnt update grid data 
            // this.value = newValue;
        }
    }
});