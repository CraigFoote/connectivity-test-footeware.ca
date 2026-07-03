import St from "gi://St";
import Clutter from "gi://Clutter";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import Soup from "gi://Soup";

export default class ConnectivityTestExtension extends Extension {
    enable() {
        console.log("🤨🤨🤨🤨🤨🤨 enable");
        this.indicator = new PanelMenu.Button(0.0, this.metadata.name, false);

        const icon = new St.Icon({
            icon_name: "face-laugh",
            style_class: "system-status-icon",
        });

        const button = new St.Button({
            reactive: true,
            child: icon,
            style_class: "panel-status-button",
        });

        this.url = "https://httpbin.org/delay/10";
        button.connect("button-press-event", (button, event) => {
            this.on_click();
        });

        this.indicator.add_child(button);
        Main.panel.addToStatusArea(this.uuid, this.indicator);

        this.session = new Soup.Session();
        this.cancellable = null;
    }

    disable() {
        console.log("🤨🤨🤨🤨🤨🤨 disable, cancelling cancellable.");
        this.cancellable?.cancel();
        this.cancellable = null;
        this.url = null;
        this.indicator?.destroy();
        this.indicator = null;
    }

    on_click() {
        const message = Soup.Message.new(
            "HEAD",
            this.url,
        );
        if (message) {
            this.cancellable = new Gio.Cancellable();
            console.log("🤨🤨🤨🤨🤨🤨 Request to " + this.url);
            this.session.send_and_read_async(
                message,
                GLib.PRIORITY_DEFAULT,
                this.cancellable,
                (session, result, error) => {
                    if (error) {
                        console.log("🤨🤨🤨 Response, error=" + error);
                        return;
                    } else {
                        console.log("🤨🤨🤨 Response, no error");
                    }

                    const soupStatus = message.status_code;
                    const soupStatusText = message.reason_phrase;
                    console.log(
                        `🤨🤨🤨 Response status=${soupStatus} ${soupStatusText}`,
                    );

                    try {
                        console.log("🤨🤨🤨 Response, getting result");
                        const bytes = session.send_and_read_finish(result);
                        const decoder = new TextDecoder('utf-8');
                        const responseText = decoder.decode(bytes.toArray());
                        console.log("🤨🤨🤨 Response, responseText=" + responseText);
                    } catch (e) {
                        console.log("🤨🤨🤨 Response, error thrown getting result", e);
                        if (e.matches(Gio.IOErrorEnum, Gio.IOErrorEnum.CANCELLED)) {
                            console.log("🤨🤨🤨 Response, cancelled!!");
                        }
                    }
                });
        }
    }
}
