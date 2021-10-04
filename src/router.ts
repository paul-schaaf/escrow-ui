import { createRouter, createWebHistory } from 'vue-router'

const Alice = () => import("./Alice.vue")
const Bob = () => import("./Bob.vue")
const Cancel = () => import("./Cancel.vue")

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: "Alice",
            path: "/",
            component: Alice
        },
        {
            name: "Bob",
            path: "/bob",
            component: Bob
        },
        {
            name: "Cancel",
            path: "/cancel",
            component: Cancel
        }
    ]
})
