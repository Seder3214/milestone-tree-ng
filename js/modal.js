var modal = {
    showModal: false,
    title: "",
    desc: "",
    cancel: "",
    hide() {
        this.showModal = false
    },
    show(t, c, d = "Close") {
        this.showModal = true
        this.title = t
        this.desc = c
        this.cancel = d
    },
}
