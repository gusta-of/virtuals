const connection = {
    socket: undefined,
}

function disconnect() {
    connection.socket.disconnect();
    this.exception.innerHTML = `Desconectado`;
    this.btnStatus.classList.remove('disabled');
    document.querySelector("#txtID").classList.remove('disabled');
    this.btnDisconnect.classList.add('disabled');
    this.statusConnection.classList.add('text-danger');
    this.statusConnection.innerHTML = 'OFF';
    connection.socket = undefined;
}

function connect() {

    if (!connection.socket) {

        let identity = document.querySelector("#txtID").value;
        if(!identity) {
            this.exception.innerHTML = "É necessário se identificar";
            return;
        }
        let connectionAttempts = 0;

        try {
            connection.socket = io('http://0.0.0.0:3000', {
                path: "/beautyfy_vituals/",
                transports: ['websocket'],
                query: { roomType: 'schedule', email: identity } 
            });

            connection.socket.on('online_user_room_schedule', (users) => {
                debugger
                if(users) {
                    let li = '';
                    users
                        .forEach(i => {
                            li += `<li>${i.email}</li>`
                        })
                    document.querySelector("#onliUsers").innerHTML = li;
                }
            });

            connection.socket.on('connect', () => {
                this.exception.innerHTML = '';
                connectionAttempts = 0;
                this.statusConnection.classList.remove('text-danger');
                this.statusConnection.classList.add('text-success');
                this.statusConnection.innerHTML = 'ON';
                this.btnStatus.classList.add('disabled');
                document.querySelector("#txtID").classList.add('disabled');
                this.btnDisconnect.classList.remove('disabled');

                setTimeout(() => {
                    connection.socket.emit('authSessionRoomSchedule');
                }, 3000);
                
            });

            connection.socket.on('connect_error', (error) => {
                connectionAttempts++;
                this.exception.innerHTML = `Tentativa ${connectionAttempts}: ${error.message}`;
                this.statusConnection.classList.remove('text-success');
                this.statusConnection.classList.add('text-danger');
                this.statusConnection.innerHTML = 'OFF';

                if (connectionAttempts >= 5) {
                    this.exception.innerHTML = 'Número máximo de tentativas alcançado. Desconectando...';
                    connection.socket.disconnect();
                    connection.socket = undefined;
                    setTimeout(() => { 
                        this.exception.innerHTML = `Número máximo de tentativas alcançado. Status: desconectado`;
                        his.btnStatus.classList.remove('disabled');
                    }, 3000);
                }
            });

            connection.socket.on('connect_failed', () => {
                connectionAttempts++;
                this.exception.innerHTML = `Tentativa ${connectionAttempts}: Falha na conexão`;
                this.statusConnection.classList.remove('text-success');
                this.statusConnection.classList.add('text-danger');
                this.statusConnection.innerHTML = 'OFF';
                if (connectionAttempts >= 5) {
                    this.exception.innerHTML = 'Número máximo de tentativas alcançado. Desconectando...';
                    connection.socket.disconnect();
                    connection.socket = undefined;
                    setTimeout(() => { 
                        this.exception.innerHTML = `Número máximo de tentativas alcançado. Status: desconectado`;
                        his.btnStatus.classList.remove('disabled');
                    }, 3000);
                }
            });

        } catch (e) {
            console.error('Erro ao tentar conectar:', e.message);
            this.exception.innerHTML = e?.message;
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    this.btnStatus = document.querySelector("#btnStatus");
    this.statusConnection = document.querySelector("#statusConnection");
    this.exception = document.querySelector("#exception");
    this.btnDisconnect = document.querySelector("#btnDisconnect")
});