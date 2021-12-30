/*
 * @Author: JL
 * @Date: 2021-12-30 14:30:35
 */
"use strict";
Vue.component("Lang-RichText", {
    dependencies: ["packages://inspector/inspectors/comps/richtext.js"],
    template: `
            <ui-prop
                v-prop="target.tid"
                :multi-values="multi"
            ></ui-prop>
            <cc-richtext :target.sync="target"></cc-richtext>
        `,
    props: {
        target: {
            twoWay: true,
            type: Object
        },
        multi: {
            type: Boolean
        },
    },
}, );