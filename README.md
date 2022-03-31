# Lokinet Control GUI

This repository contains a cross-platform GUI for controlling and observing stats from a locally-running lokinet. See also [loki-network](https://github.com/oxen-io/loki-network).

## Build Instructions
 
Build deps:

* [nvm](https://github.com/nvm-sh/nvm) or [asdf](https://github.com/asdf-vm/asdf)
* git
* wine (for windows builds)
 
Clone the repo:

    $ git clone https://github.com/oxen-io/lokinet-gui

Build the project:

    $ yarn install --frozen-lockfile
    $ yarn dist

### CI Builds

builds from ci can be obtained from our [ci server](https://oxen.rocks)

### Env variables

To avoid being asked to start/stop the lokinet daemon on every start of this GUI you can set the environment variable
`DISABLE_AUTO_START_STOP=anything` on your system or before starting the GUI.
