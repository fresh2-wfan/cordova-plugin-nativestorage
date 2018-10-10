/**
 * Created by Christian on 30.08.2016.
 * christian@helbighof.de
 */

var package = Windows.ApplicationModel.Package.current;
var service = package.id.name

var NativeStorageProxy = {
    getItem: function (win, fail, args) {
        try {
            var key = args[0];
            var value = Windows.Storage.ApplicationData.current.localSettings.values[key];
            // A value of undefined will throw a JSON error during the win() callback
            if (value === undefined) {
                fail(2);
            }
            else {
                win(value);
            }
        } catch (e) {
            fail(2);
        }
    },
    setItem: function (win, fail, args) {
        try {
            var key = args[0],
                value = args[1];
            // A value of undefined will throw a JSON error during the win() callback
            if (value === undefined) {
                fail(3);
            }
            else {
                Windows.Storage.ApplicationData.current.localSettings.values[key] = value;
                win(value);
            }
        } catch (e) {
            fail(1);
        }
    },
    clear: function (win, fail, args) {
        try {
            Windows.Storage.ApplicationData.current.localSettings.values.clear();
            win();
        } catch (e) {
            fail(1);
        }
    },
    putString: function (win, fail, args) {
        this.setItem(win, fail, args);
    },
    getString: function (win, fail, args) {
        this.getItem(win, fail, args);
    },
    putBoolean: function (win, fail, args) {
        this.setItem(win, fail, args);
    },
    getBoolean: function (win, fail, args) {
        this.getItem(win, fail, args);
    },
    putInt: function (win, fail, args) {
        this.setItem(win, fail, args);
    },
    getInt: function (win, fail, args) {
        this.getItem(win, fail, args);
    },
    putDouble: function (win, fail, args) {
        this.setItem(win, fail, args);
    },
    getDouble: function (win, fail, args) {
        this.getItem(win, fail, args);
    },
    remove: function (win, fail, args) {
        try {
            var values = Windows.Storage.ApplicationData.current.localSettings.values,
                key = args[0];
            if (values.hasKey(key)) {
                values.remove(key);
                win(key);
            }
            else {
                fail(2);
            }
        } catch (e) {
            fail(1);
        }
    },
    keys: function (win, fail) {
        try {
            var values = Windows.Storage.ApplicationData.current.localSettings.values,
                keys = [];
            for (var p in values) {
                if (values.hasOwnProperty(p)) {
                    keys.push(p);
                }
            }
            win(keys);
        } catch (e) {
            fail(2);
        }
    }
};

require("cordova/exec/proxy").add("NativeStorage", NativeStorageProxy);
