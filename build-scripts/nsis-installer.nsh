!macro customInstall
    nsExec::Exec '"sc.exe" failure lokinet reset= 60 actions= restart/5000'
!macroend