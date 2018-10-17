/**
 * Created by Christian on 30.08.2016.
 * christian@helbighof.de
 */

var package = Windows.ApplicationModel.Package.current;
var service = package.id.name;

// Because localSettings has a content limit of 8KB for each simple key,
// and 64KB for each composite key, we'd store larger objects as files instead.
// Items with this key prefix would be saved as files:
var KEY_PREFIX_FILES = 'blob';

// Reference and Example Code:
// https://docs.microsoft.com/en-us/uwp/api/Windows.Storage.ApplicationData
var applicationData = Windows.Storage.ApplicationData.current;

// Change this to var roamingFolder = applicationData.roamingFolder;
// to use the RoamingFolder instead, for example.
var localFolder = applicationData.localFolder;

var NativeStorageProxy = {
    getItem: function (win, fail, args) {
        try {
            var key = args[0];

            if (key.indexOf(KEY_PREFIX_FILES) === 0) {
                // key begins with blob prefix so get value from blob
                localFolder.getFileAsync(key).then(function (file) {
                    return Windows.Storage.FileIO.readTextAsync(file);
                }).done(function (blob) {
                    if (blob === undefined) {
                        fail(2);
                    } else {
                        win(blob);
                    }
                }, function () {
                    // Key not found
                    fail(2);
                });
                return;
            }

            var value = Windows.Storage.ApplicationData.current.localSettings.values[key];
            // A value of undefined will throw a JSON error during the win() callback
            if (value === undefined) {
                fail(2);
            } else {
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
            } else {
                if (key.indexOf(KEY_PREFIX_FILES) === 0) {
                    // Use key as file name, value as file content
                    localFolder.createFileAsync(
                        key, Windows.Storage.CreationCollisionOption.replaceExisting
                    ).then(function (file) {
                        return Windows.Storage.FileIO.writeTextAsync(file, value);
                    }).done(function () {
                        win(value);
                    });
                    return;
                }

                Windows.Storage.ApplicationData.current.localSettings.values[key] = value;
                win(value);
            }
        } catch (e) {
            fail(1);
        }
    },
    clear: function (win, fail, args) {
        try {
            // Clear both localSettings and localFolder
            applicationData.ClearAsync().then(function () {
                win();
            });
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
            var values, key = args[0];
            if (key.indexOf(KEY_PREFIX_FILES) === 0) {
                localFolder.getFileAsync(key).then(function (file) {
                    if (file !== null) {
                        file.DeleteAsync().done(function () {
                            win(key);
                        }, function () {
                            fail(2);
                        });
                    } else {
                        // File already removed
                        win(key);
                    }
                });
                return;
            }

            values = Windows.Storage.ApplicationData.current.localSettings.values;
            if (values.hasKey(key)) {
                values.remove(key);
                win(key);
            } else {
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

            // Add localSettings keys
            for (var p in values) {
                if (values.hasOwnProperty(p)) {
                    keys.push(p);
                }
            }

            // Add localFolder keys
            localFolder.getFilesAsync().done(function (files) {
                files.forEach(function (file) {
                    keys.push(file.name);
                });
                win(keys);
            });
        } catch (e) {
            fail(2);
        }
    }
};

require("cordova/exec/proxy").add("NativeStorage", NativeStorageProxy);
