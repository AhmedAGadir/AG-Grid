import Vue from "vue";

export default Vue.extend({
    template: `
        <div>
            <div v-if="response === null">
                <button @click="approved()">thumb_up</button>
                <button @click="rejected()">thumb_down</button>
            </div>
            <!-- Rejected -->
            <div v-else-if="response === 1" class="cl-response-text">
                <div>
                    approved 
                </div>            
            </div>
            <div v-else-if="response === 2" class="cl-response-text">
                <div>
                    rejected 
                </div>            
            </div>
        </div>
    `,
    data: function () {
        return {
            response: null
        };
    },
    beforeMount() {
    },
    mounted() {
        this.response = this.params.value;
    },
    methods: {
        approved() {
            // updates UI but doesn't update grid data 
            // this.value = newValue;
            this.params.setValue(1);
        },
        rejected() {
            this.params.setValue(2);
        }
    }
});



