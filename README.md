# Lokinet Control GUI

This repository contains a cross-platform GUI for controlling and observing stats from a locally-running lokinet. See also [loki-network](https://github.com/oxen-io/loki-network).

## Build Instructions for development

### Clone the dev branch

    git clone https://github.com/oxen-io/loki-network-gui -b dev
    cd loki-network-gui/

### Download nvm and set the project up

    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
    nvm install # install node version from the .nvmrc file
    nvm use

### Install yarn

    npm install --global yarn
    yarn install

### Start the app on development mode

#### On one terminal start the electron process

    yarn dev:electron

#### On another terminal start the rebuild on file change

    nvm use
    yarn dev:react

if the screen stays grey, you might need to CTRL-R the app

### Build binaries

After running the `yarn install --frozen-lockfile` command, you should be able to run `yarn dist` to build the binaries.
They will be saved under `./release`.

### MacOS

set up signing keys:

    npm config set lokinet-gui:pubkey pubkey_id_goes_here

build a codesigned release:

    yarn install --frozen-lockfile
    yarn macos:release


### CI Builds

builds from ci can be obtained from our [ci server](https://oxen.rocks)
