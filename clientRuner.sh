#!/bin/sh

MAX_AMOUNT_OF_CLIENTS=25
signalers=()
ports=()

getPort () {
    min=3500
    max=9000
    result=$(shuf -i $min-$max -n 1)

    echo "$result"
}

runClients () {
    for (( i=1; $i <= $1; i++ )) ; do
        port=$(getPort)
        node app.js $port $i &>/dev/null &
		    printf "Client start on port: $port with pid: $!\n"
		    signalers+=($!)
		    ports+=("$port")
	  done
}

removeFromList () {
    signalersTemp=()
    portsTemp=()
    removed="false"
    for i in "${!signalers[@]}"; do
        if [[ "${signalers[i]}" == "$1" ]]; then
            removed="true"
	          printf "Client with pid: $1 stopped successffuly\n"
        else
            signalersTemp+=("${signalers[i]}")
            portsTemp+=("${ports[i]}")
        fi
    done

    if [ "$removed" == "true" ]; then
        signalers=("${signalersTemp[@]}")
        ports=("${portsTemp[@]}")
    else
        printf "Client with $1 does not exist"
    fi
}

removeClientByPid () {
  kill -9 "$1"
	removeFromList "$1"
}

stop() {
    if [ -z "$1" ]; then
        signalersTempStop=("${signalers[@]}")
        for i in "${!signalersTempStop[@]}"; do
            removeClientByPid "${signalersTempStop[i]}"
        done
    else
        removeClientByPid "$1"
    fi

    printListOfClients
}

printListOfClients () {
	  printf "List of clients (${#signalers[@]}):\n"
    for i in "${!signalers[@]}"; do
		    printf "Client with pid: ${signalers[$i]} is running on port: ${ports[$i]}\n"
	  done

	  printf "\n"
}

help () {
    printf "Option:\n"
    printf "run <n>    - run 'n' clients (max 25)\n"
    printf "run        - run 25 clients\n"
    printf "stop <pid> - stop client with passed 'pid'\n"
    printf "stop       - stop all client\n"
    printf "clients    - prints list of active clients\n\n"
}

menu () {
    help
    read command param

    if [ "$command" == "run" ]; then
        if [ -z "$param" ]; then
            param=$MAX_AMOUNT_OF_CLIENTS
        fi
        if [ "$param" -gt "$MAX_AMOUNT_OF_CLIENTS" ]; then
            printf "Max amount of clients is $MAX_AMOUNT_OF_CLIENTS\n"
            runClients "$MAX_AMOUNT_OF_CLIENTS"
        else
            printf "Starting $param clients: \n"
            runClients "$param"
        fi
    elif [ "$command" == "stop" ]; then
        stop "$param"
    elif [ "$command" == "clients" ]; then
        printListOfClients
    else
        printf "Unkonw command\n\n"
    fi

    printf "\n\n"
}

# main() {
while true ; do
    menu
done
# }