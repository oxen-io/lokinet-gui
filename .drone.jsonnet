local default_deps="npm yarn";
local default_windows_deps='zip nsis npm yarn';
local docker_image = 'registry.oxen.rocks/lokinet-ci-nodejs';

local submodules = {
    name: 'submodules',
    image: 'drone/git',
    commands: ['git fetch --tags', 'git submodule update --init --recursive --depth=1']
};

local apt_get_quiet = 'apt-get -o=Dpkg::Use-Pty=0 -q';

// Regular build on a debian-like system:
local debian_pipeline(name, image,
        arch='amd64',
        deps=default_deps,
        build_type='Release',
        target='deb',
        extra_cmds=[],
        loki_repo=false,
        allow_fail=false) = {
    kind: 'pipeline',
    type: 'docker',
    name: name,
    platform: { arch: arch },
    trigger: { branch: { exclude: ['debian/*', 'ubuntu/*'] } },
    steps: [
        submodules,
        {
            name: 'build',
            image: image,
            [if allow_fail then "failure"]: "ignore",
            environment: { SSH_KEY: { from_secret: "SSH_KEY" } },
            commands: [
                'echo "Building on ${DRONE_STAGE_MACHINE}"',
                'echo "man-db man-db/auto-update boolean false" | debconf-set-selections',
                apt_get_quiet + ' update',
                apt_get_quiet + ' install -y eatmydata',
                'eatmydata ' + apt_get_quiet + ' dist-upgrade -y',
                "yarn --version",
                "node --version",
                "mkdir -p $CCACHE_DIR/yarn",
                "yarn install --frozen-lockfile --cache-folder $CCACHE_DIR/yarn",
                "yarn --cache-folder $CCACHE_DIR/yarn " + target
            ] + extra_cmds,
        }
    ],
};
// windows cross compile on debian
local windows_cross_pipeline(name, image,
        arch='amd64',
        build_type='Release',
        extra_cmds=[],
        allow_fail=false) = {
    kind: 'pipeline',
    type: 'docker',
    name: name,
    platform: { arch: arch },
    trigger: { branch: { exclude: ['debian/*', 'ubuntu/*'] } },
    steps: [
        submodules,
        {
            name: 'build',
            image: image,
            [if allow_fail then "failure"]: "ignore",
            environment: { SSH_KEY: { from_secret: "SSH_KEY" }, WINDOWS_BUILD_NAME: "x64" },
            commands: [
                'echo "Building on ${DRONE_STAGE_MACHINE}"',
                'echo "man-db man-db/auto-update boolean false" | debconf-set-selections',
                apt_get_quiet + ' update',
                apt_get_quiet + ' install -y eatmydata zip',
                'eatmydata ' + apt_get_quiet + ' dist-upgrade -y',
                "yarn --version",
                "node --version",
                "yarn install --frozen-lockfile --cache-folder $CCACHE_DIR/yarn",
                "WINEDEBUG=-all WINEPREFIX=$(pwd)/wineprefix yarn win32 --cache-folder $CCACHE_DIR/yarn"
            ] + extra_cmds,
        }
    ],
};


// Macos build
local mac_builder(name, build_type='Release', werror=true, cmake_extra='', extra_cmds=[], allow_fail=false) = {
    kind: 'pipeline',
    type: 'exec',
    name: name,
    platform: { os: 'darwin', arch: 'amd64' },
    steps: [
        { name: 'submodules', commands: ['git fetch --tags', 'git submodule update --init --recursive'] },
        {
            name: 'build',
            environment: { SSH_KEY: { from_secret: "SSH_KEY" } },
            commands: [
                'echo "Building on ${DRONE_STAGE_MACHINE}"',
                // If you don't do this then the C compiler doesn't have an include path containing
                // basic system headers.  WTF apple:
                'export SDKROOT="$(xcrun --sdk macosx --show-sdk-path)"',
                'ulimit -n 1024', // because macos sets ulimit to 256 for some reason yeah idk
                'yarn install --frozen-lockfile && yarn macos',
            ] + extra_cmds,
        }
    ]
};


[
    windows_cross_pipeline("Windows (x64)", docker_image,
       extra_cmds=[
           './contrib/ci/drone-static-upload.sh'
       ]),

    debian_pipeline("Linux (appimage)", docker_image, target='appImage', extra_cmds=["./contrib/ci/drone-static-upload.sh"]),
    debian_pipeline("Linux (deb)", docker_image, target='deb', extra_cmds=["./contrib/ci/drone-static-upload.sh"])
]
