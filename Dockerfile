FROM rockylinux:8

WORKDIR /srv/dashboard

# Timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

# 基本パッケージ
RUN dnf update -y && dnf clean all
RUN dnf install -y \
    gcc \
    make \
    zlib-devel \
    openssl \
    openssl-devel \
    libffi-devel \
    git \
    mysql \
    mariadb-connector-c-devel \
    systemd

# Python 3.11
RUN dnf install -y python39 python39-pip python39-devel

# Node.js 20
RUN dnf module -y enable nodejs:20
RUN dnf install -y nodejs npm

# Pythonパッケージ管理の準備
RUN python3.9 -m pip install --upgrade pip

# 作業ディレクトリ設定
WORKDIR /srv/dashboard

# systemdで起動
CMD ["/sbin/init"]