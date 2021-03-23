import { invoke } from "./lokinetProcessManager";



export const doStartLokinetProcessSystemd = async (): Promise<boolean> => {
    return invoke('systemctl', ['--no-block', 'start', 'lokinet.service']);
};

export const doStopLokinetProcessSystemd = async (): Promise<boolean> => {
    return invoke('systemctl', ['--no-block', 'stop', 'lokinet.service']);
};

// systemd's "stop" is a managed stop -- it will do its own forceful kill
export const doForciblyStopLokinetProcessSystemd = async (): Promise<boolean> => {
    return doStopLokinetProcessSystemd();
};
