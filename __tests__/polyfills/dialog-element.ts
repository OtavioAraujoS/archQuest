const dialogPrototype = HTMLDialogElement.prototype

if (!dialogPrototype.showModal) {
  dialogPrototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true
  }
}

if (!dialogPrototype.close) {
  dialogPrototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
