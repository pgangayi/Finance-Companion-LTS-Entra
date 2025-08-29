import sys
import subprocess
import os
import platform
import time

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
        # Install psycopg2-binary only if POSTGRES_ENABLED is set
        "pandas==2.2.2",
        "openpyxl==3.1.2",
        "alembic==1.13.1"
    ]

    if os.getenv("POSTGRES_ENABLED", "false").lower() in ("true", "1", "yes"):
        optional_deps.insert(0, "psycopg2-binary")  # No pinned version — grab latest wheel if available
    else:
        print("⏭️ Skipping psycopg2-binary (PostgreSQL driver) — local dev mode")

    installed = []
    skipped = []
    failed = []

    def install_if_needed(package):
        if "==" in package:
            pkg_name, required_version = package.split("==")
        else:
            pkg_name, required_version = package, None

        if required_version and is_version_installed(pkg_name, required_version):
            print(f"✅ {package} already installed.")
            skipped.append(package)
            return False
        elif not required_version:
            try:
                _ = version(pkg_name)
                print(f"✅ {pkg_name} already installed.")
                skipped.append(package)
                return False
            except PackageNotFoundError:
                pass

        if dry_run:
            print(f"[Dry Run] Would install: {package}")
            return False

        try:
            print(f"📦 Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], check=True)
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
    return subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--reload"],
        cwd="church_finance_backend"
    )


def start_frontend():
    print("\n🌐 Starting frontend (React)...")
    frontend_path = os.path.join(os.getcwd(), "church_finance_frontend")
    if not os.path.isdir(frontend_path):
        print("⚠️ Frontend directory not found. Skipping frontend startup.")
        return None

    cmd = ["npm", "start"]
    if platform.system() == "Windows":
        return subprocess.Popen(["cmd", "/c"] + cmd, cwd=frontend_path)
    else:
        return subprocess.Popen(cmd, cwd=frontend_path)


if __name__ == "__main__":
    install_backend_dependencies()

    backend_proc = start_backend()
    frontend_proc = start_frontend()

    # Let frontend boot before printing URLs
    if frontend_proc:
        print("\n⏳ Giving frontend a few seconds to compile...")
        time.sleep(5)  # adjust if React is slower/faster to compile

    print("\n====================================")
    print("✅ Backend running at:  http://127.0.0.1:8000  (docs: /docs)")
    if frontend_proc:
        print("✅ Frontend running at: http://localhost:3000")
    else:
        print("⚠️ Frontend not started")
    print("====================================\n")

    try:
        backend_proc.wait()
        if frontend_proc:
            frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        backend_proc.terminate()
        if frontend_proc:
            frontend_proc.terminate()
