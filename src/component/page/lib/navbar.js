import React from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineLogout, AiFillContainer,AiFillHome, AiOutlineClockCircle, AiOutlineCheckCircle, AiOutlineTable, AiOutlineAim, AiOutlineApartment, AiOutlineInfoCircle } from 'react-icons/ai';

export const admin = [
    {
        hash: "/",
        page: "Homepage",
        icon: AiFillHome,
        to: "/"
    },
    {
        hash: "/timesheet",
        page: "Input Timesheet",
        icon: AiOutlineClockCircle,
        to: "/timesheet"
    },
    {
        hash: "/manager",
        page: "Timesheet Approval",
        icon: AiOutlineCheckCircle,
        to: "/manager"
    },
    {
        hash: "/viewmytimesheet",
        page: "View My Timesheet",
        icon: AiFillContainer,
        to: "/viewmytimesheet"
    },
    {
        hash: "/date",
        page: "Create Date Table",
        icon: AiOutlineTable,
        to: "/date"
    },
    {
        hash: "/showdate",
        page: "Show Date",
        icon: AiOutlineTable,
        to: "/showdate"
    },
    {
        hash: "/department",
        page: "Create Department",
        icon: AiOutlineAim,
        to: "/department"
    },
    {
        hash: "/showdepartment",
        page: "Show Department",
        icon: AiOutlineApartment,
        to: "/showdepartment"
    },
    {
        hash: "/about",
        page: "About",
        icon: AiOutlineInfoCircle,
        to: "/about"
    },
];

export const user = [
    {
        hash: "/",
        page: "Homepage",
        icon: AiFillHome,
        to: "/"
    },
    {
        hash: "/timesheet",
        page: "Timesheet",
        icon: AiOutlineClockCircle,
        to: "/timesheet"
    },
    {
        hash: "/viewmytimesheet",
        page: "View My Timesheet",
        icon: AiFillContainer,
        to: "/viewmytimesheet"
    },
    {
        hash: "/showdate",
        page: "Show Date",
        icon: AiOutlineTable,
        to: "/showdate"
    },
    {
        hash: "/showdepartment",
        page: "Show Department",
        icon: AiOutlineApartment,
        to: "/showdepartment"
    },
    {
        hash: "/about",
        page: "About",
        icon: AiOutlineInfoCircle,
        to: "/about"
    },
];
