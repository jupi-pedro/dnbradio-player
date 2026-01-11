export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const userAgent = navigator.userAgent;
    console.log(userAgent);
    if (
      /iphone_os_4|iphone_os_5|iphone_os_6|iphone_os_7|iphone_os_8|iphone_os_9|safari\/525|safari\/533|safari\/534|safari\/601|safari\/600/i.test(
        userAgent
      )
    ) {
      console.log("redirecting...");
      return navigateTo("https://dnbradio.com/mobile", { external: true });
    }
  }
});
