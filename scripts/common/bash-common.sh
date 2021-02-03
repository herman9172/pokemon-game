#!/bin/bash
# ------------------------------------------------------------------
# -- Bash common functionality
# --
# -- @author Pablo Viquez <pviquez@pabloviquez.com>
# ------------------------------------------------------------------

# Util vars
COLOR_RED=$(tput setaf 1)
COLOR_GREEN=$(tput setaf 2)
COLOR_BLUE=$(tput setaf 4)
COLOR_WHITE=$(tput setaf 7)
COLOR_NORMAL=$(tput sgr0)
COL_POS=80


function get_input_data()
{
    local _resultvar=$2
    local usr_input=""

    while [ -z "${usr_input}" ]
    do
        printf "${COLOR_WHITE}${1}${COLOR_NORMAL}"
        read usr_input
    done

    eval ${_resultvar}="'${usr_input}'"
}

function get_input_password()
{
    local _resultvar=$2
    local usr_input=""

    while [ -z "${usr_input}" ]
    do
        printf "${COLOR_WHITE}${1}${COLOR_NORMAL}"
        read -s usr_input
    done

    eval ${_resultvar}="'${usr_input}'"
}

function pause()
{
    printf "${COLOR_WHITE}Press any key to continue...${COLOR_NORMAL}"
    read usr_input
}

function print_fail()
{
    let colPos=${COL_POS}-${#1}
    printf '%s%s%*s%s' "${1}" "${COLOR_RED}" $colPos " ☠️  " "${COLOR_NORMAL}"
    echo ""
}

function print_success()
{
    let colPos=${COL_POS}-${#1}
    printf '%s%s%*s%s' "${1}" "${COLOR_GREEN}" $colPos " 👍🏼" "${COLOR_NORMAL}"
    echo ""
}

function get_input_data_yes_no()
{
    local _resultvar=$2
    local usr_input=""

    while [ -z ${usr_input} ]
    do
        printf "${COLOR_WHITE}${1}${COLOR_NORMAL} "
        read yn

        case $yn in
            Y|N|y|n) usr_input=${yn};;
            *) echo "Please answer Y or N";;
        esac
    done

    eval ${_resultvar}="'${usr_input}'"
}

function aws_print_logo ()
{
    clear
    echo ""
    echo ""
    echo " █████╗ ██╗    ██╗███████╗       ██████╗██╗     ██╗"
    echo "██╔══██╗██║    ██║██╔════╝      ██╔════╝██║     ██║"
    echo "███████║██║ █╗ ██║███████╗█████╗██║     ██║     ██║"
    echo "██╔══██║██║███╗██║╚════██║╚════╝██║     ██║     ██║"
    echo "██║  ██║╚███╔███╔╝███████║      ╚██████╗███████╗██║"
    echo "╚═╝  ╚═╝ ╚══╝╚══╝ ╚══════╝       ╚═════╝╚══════╝╚═╝"
    echo "                                                   "
    echo ""
    echo "Amazon Web Services - CLI"
    echo ""
}

function aws_is_aws_cli_installed ()
{
    local _resultvar=$1
    isFail=1

    awscliVer="$(aws 2>&1)"
    if [[ "${awscliVer}" =~ "aws help" ]]; then
        print_success " - AWS Tool Installed"
    else
        print_fail " - AWS Tool Installed"
        isFail=0
    fi
    eval "${_resultvar}"="'${isFail}'"
}

