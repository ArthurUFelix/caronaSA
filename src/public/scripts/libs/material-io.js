mdc.autoInit();

const drawer = mdc.drawer.MDCDrawer.attachTo(
  document.querySelector(".mdc-drawer")
);
const topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(
  document.querySelector("#app-bar")
);
topAppBar.listen("MDCTopAppBar:nav", () => {
  drawer.open = !drawer.open;
});

const select = mdc.select.MDCSelect.attachTo(
  document.querySelector(".mdc-select")
);
