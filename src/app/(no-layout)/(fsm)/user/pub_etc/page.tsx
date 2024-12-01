'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { TextField, Select, MenuItem, Checkbox, FormControlLabel,FormControl, InputLabel,RadioGroup } from '@mui/material';
import { CustomFormLabel, CustomSelect, CustomTextField,CustomRadio } from '@/utils/fsms/fsm/mui-imports';
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox';
// import { ErrorStatus } from '@/utils/fsms/common/messageUtils'
import ModalDetailReply from './_components/ModalDetailReply';
import ModalFormReply from './_components/ModalFormReply';
import ModalSatisfaction from './_components/ModalSatisfaction';
import ModalCalendar from './_components/ModalCalendar';

import "@/app/assets/css/layoutFsm.css";

import {
  PageContainer,
} from '@/utils/fsms/fsm/mui-imports'


const SignupPage: React.FC = () => {
  
  return (
    <PageContainer>

        <ModalDetailReply
            size="lg"
            buttonLabel="소송/심판 사례 상세"
            title="소송/심판 사례"
        />

        <ModalFormReply
            size="lg"
            buttonLabel="소송/심판 사례 수정"
            title="소송/심판 사례"
        />

        <ModalSatisfaction
            buttonLabel="FSMS 고객만족도 조사"
            title="FSMS 고객만족도 조사"
        />

        <ModalCalendar
            buttonLabel="부제일 달력"
            title="부제일 달력"
        />
            
    </PageContainer>
  )
}

export default SignupPage
