# connectivity-test@footeware.ca

A test to determine the correct sequence of code to detect HTTP requests' (via Soup) cancellation during computer suspend mode.

1. clone repo, run `./BUILD.sh`
2. run `gnome-extensions install -f ./connectivity-test@footeware.ca`
3. run `dbus-run-session gnome-shell --devkit --wayland` to start a new embedded GNOME Shell
4. in its panel click this extension's happy face icon
5. note in console output the lines indicated by 🤨 characters. In particular, "🤨🤨🤨🤨🤨🤨 Request to https://httpbin.org/delay/10" is output when the request is made. You then have 10 seconnds to wait for response. If, in the meantime, the computer enters suspend mode (not sleep), the response should indicate the request was cancelled.
