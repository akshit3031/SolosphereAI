import platform
import subprocess
import psutil

def get_os():
    return platform.system()

def check_disk_encryption():
    os_type = get_os()
    try:
        if os_type == "Windows":
            output = subprocess.check_output("manage-bde -status", shell=True)
            return "Percentage Encrypted" in output.decode()
        elif os_type == "Darwin":
            output = subprocess.check_output(["fdesetup", "status"])
            return "FileVault is On" in output.decode()
        elif os_type == "Linux":
            output = subprocess.check_output("lsblk", shell=True).decode()
            return "crypt" in output
    except:
        return False

def check_os_update():
    os_type = get_os()
    try:
        if os_type == "Windows":
            return "Check manually"  # Windows API not simple via Python
        elif os_type == "Darwin":
            out = subprocess.check_output(["softwareupdate", "-l"])
            return "No new software available" in out.decode()
        elif os_type == "Linux":
            out = subprocess.check_output("apt list --upgradable", shell=True).decode()
            return "upgradable" not in out
    except:
        return "Unknown"

def check_antivirus():
    os_type = get_os()
    if os_type == "Windows":
        return "Windows Defender (Check manually or via PowerShell)"
    elif os_type == "Darwin" or os_type == "Linux":
        return "Check if ClamAV or other AV is installed"
    return "Unknown"

def check_sleep_setting():
    os_type = get_os()
    try:
        if os_type == "Windows":
            out = subprocess.check_output("powercfg /q", shell=True).decode()
            return "10" in out  # crude check
        elif os_type == "Darwin":
            out = subprocess.check_output(["pmset", "-g"]).decode()
            return "sleep" in out and "10" in out
        elif os_type == "Linux":
            out = subprocess.check_output("gsettings get org.gnome.settings-daemon.plugins.power sleep-inactive-ac-timeout", shell=True).decode()
            return int(out.strip()) <= 600
    except:
        return False
