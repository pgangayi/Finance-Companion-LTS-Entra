import sys
import subprocess
import os
import platform

try:
    from importlib.metadata import version, PackageNotFoundError
except ImportError:
    from importlib_metadata import version, PackageNotFoundError  # For Python <3.8

from packaging import version as packaging_version

def is_version_installed(package_name, required_version):
    try:
        installed_version = version(package_name)
        return packaging_version.parse(installed_version) >= packaging_version.parse(required_version)
    except PackageNotFoundError:
        return False

def install_backend_dependencies(dry_run=False):
    print("🔍 Checking backend dependencies...")

    critical_deps = [
        "fastapi==0.111.0",
        "uvicorn==0.29.0",
        "sqlalchemy==2.0.23",
        "pydantic==2.11.7",
        "python-jose==3.3.0",
        "passlib==1.7.4",
        "bcrypt==4.1.2",
        "python-multipart==0.0.6",
        "python-dotenv==1.0.0",
        "pyjwt==2.8.0",
        "email-validator==2.1.0",
        "msal==1.27.0",
        "requests==2.31.0",
        "starlette==0.37.2"
    ]

    optional_deps = [
        "psycopg2-binary==2.9.9",
        "pandas==2.2.2",
        "openpyxl==3.1.2",
        "alembic==1.13.1"
    ]

    installed = []
    skipped = []
    failed = []

    def install_if_needed(package):
        pkg_name, required_version = package.split("==")
        if is_version_installed(pkg_name, required_version):
            print(f"✅ {package} already installed.")
            skipped.append(package)
            return False

        if dry_run:
            print(f"[Dry Run] Would install: {package}")
            return False

        try:
            print(f"📦 Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True, capture_output=True)
            installed.append(package)
            return True
        except subprocess.CalledProcessError:
            print(f"⚠️ Warning: Failed to install {package}. Continuing...")
            failed.append(package)
            return False

    for dep in critical_deps + optional_deps:
        install_if_needed(dep)

    print("\n📊 Dependency Summary:")
    print(f"✅ Installed: {len(installed)}")
    for pkg in installed:
        print(f"   - {pkg}")
    print(f"⏭️ Skipped (already met version): {len(skipped)}")
    for pkg in skipped:
        print(f"   - {pkg}")
    if failed:
        print(f"❌ Failed: {len(failed)}")
        for pkg in failed:
            print(f"   - {pkg}")

    print("\n🎯 Dependency check completed.")
    return True

def start_backend():
    print("\n🚀 Starting backend server...")
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--reload"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Failed to start backend server.")

def start_frontend():
    print("\n🌐 Starting frontend (React)...")
    frontend_path = os.path.join(os.getcwd(), "frontend")
    if not os.path.isdir(frontend_path):
        print("⚠️ Frontend directory not found. Skipping frontend startup.")
        return

    try:
        if platform.system() == "Windows":
            subprocess.run(["cmd", "/c", "npm start"], cwd=frontend_path)
        else:
            subprocess.run(["npm", "start"], cwd=frontend_path)
    except subprocess.CalledProcessError:
        print("❌ Failed to start frontend.")

if __name__ == "__main__":
    install_backend_dependencies()
    start_backend()
    start_frontend()