let fs = require('fire-fs');
let path = require('fire-path');

const package_name = 'create-ui-template';

module.exports = {
    config_data: {},
    my_data: {
        uiOutputPath: 'assets/scripts/ui/view',
    },
    initCfg(cb) {
        let cfgPath = this._getPath();
        if (fs.existsSync(cfgPath)) {
            fs.readFile(cfgPath, 'utf-8', (err, data) => {
                if (!err) {
                    this.config_data = JSON.parse(data.toString());
                    if (!this.config_data[package_name]) {
                        this.config_data[package_name] = this.my_data;
                        this._save();
                    } else {
                        this.my_data = this.config_data[package_name];
                    }
                    cb && cb(this.my_data);
                }
            });
        } else {
            cb && cb(this.my_data);
        }
    },
    saveCfg(data) {
        this.my_data.uiOutputPath = data.uiOutputPath;
        this.config_data[package_name] = this.my_data;
        this._save();
    },
    _save() {
        let cfgPath = this._getPath();
        fs.writeFileSync(cfgPath, JSON.stringify(this.config_data));
    },
    _getPath() {
        let cfgFileName = 'package-configuration.json';
        let cfgPath = path.join(Editor.Project.path, 'settings', cfgFileName);
        return cfgPath;
    }
}