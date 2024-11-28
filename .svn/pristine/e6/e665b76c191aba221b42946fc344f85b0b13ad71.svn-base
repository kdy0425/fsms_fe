import React, { ReactNode, useRef } from 'react'
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
  CustomSelect,
  FormControlLabel,
  RadioGroup,
  FormGroup,
  CustomTextField,
  CustomRadio,
} from '@/utils/fsms/fsm/mui-imports'
import { MenuItem, FormHelperText, Radio, FormControl } from '@mui/material'
import { CodeObj } from '@/app/(no-layout)/(fsm)/user/signup/_types/CodeObjList'
import CustomCheckbox from '@/app/components/forms/theme-elements/CustomCheckbox'
import { FieldConfig } from '@/types/form'
import { MenuAuthrt } from '@/types/fsms/admin/menuListData'

interface Row {
  menuGroupCd: string
  index: number
  menuNm: string
  menuExpln: string
  httpDmndMethNm: string
  menuTypeCd: string
  urlAddr: string
  cdSeq: number
  npagYn: string
  menuTsid: string
  menuAcsAuthrtCd: string
  menuSeq: string
  userTypeCds: string[]
  menuAuthrts?: MenuAuthrt[]
  button: (qString: string, cd: { menuTsid: string }) => ReactNode
}

interface EditableCellProps {
  params: GridRenderCellParams
  fieldName: keyof Row
  editingId: string | null
  editedRow: Row | null
  errors: any
  onInputChange: (field: keyof Row, value: any) => void
  getInputProps: Function
  fieldConfig: FieldConfig[]
  menuTypeCodeList: { data: CodeObj[] }
  menuAcsAuthrtCodeList: { data: CodeObj[] }
  userTypeCodeList: { data: CodeObj[] }
  selectHttpData: { value: string; label: string }[]
}

const EditableCell: React.FC<EditableCellProps> = ({
  params,
  fieldName,
  editingId,
  editedRow,
  errors,
  onInputChange,
  getInputProps,
  fieldConfig,
  menuTypeCodeList,
  menuAcsAuthrtCodeList,
  userTypeCodeList,
  selectHttpData,
}) => {
  const isEditing = params.row.menuTsid === editingId
  //한글 중복입력 방지를 위해 입력 필드의 DOM 요소에 직접 접근
  const inputRef = useRef<HTMLInputElement>(null)

  const stopArrowKeyPropagation = (e: React.KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.stopPropagation()
    }
  }

  if (isEditing && editedRow) {
    switch (fieldName) {
      case 'menuTypeCd':
        return (
          <CustomSelect
            id="menuTypeCd"
            type="select"
            className="mui-custom-select required"
            value={editedRow?.menuTypeCd}
            error={!!errors.menuTypeCd}
            fullWidth
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'menuTypeCd')!,
              (e: React.ChangeEvent<HTMLSelectElement>) =>
                onInputChange('menuTypeCd', e.target.value),
            )}
          >
            {menuTypeCodeList.data.map((codeObj) => (
              <MenuItem key={codeObj.cdNm} value={codeObj.cdNm}>
                {codeObj.cdKornNm}
              </MenuItem>
            ))}
            <FormHelperText>{errors[fieldName]}</FormHelperText>
          </CustomSelect>
        )
      case 'menuAcsAuthrtCd':
        return (
          <CustomSelect
            id="menuAcsAuthrtCd"
            type="select"
            className="mui-custom-select required"
            value={editedRow?.menuAcsAuthrtCd}
            error={!!errors.menuAcsAuthrtCd}
            fullWidth
            onKeyDown={stopArrowKeyPropagation}
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'menuAcsAuthrtCd')!,
              (e: React.ChangeEvent<HTMLSelectElement>) =>
                onInputChange('menuAcsAuthrtCd', e.target.value),
            )}
          >
            {menuAcsAuthrtCodeList.data.map((codeObj: CodeObj) => (
              <MenuItem key={codeObj.cdNm} value={codeObj.cdNm}>
                {codeObj.cdKornNm}
              </MenuItem>
            ))}
            <FormHelperText>{errors[fieldName]}</FormHelperText>
          </CustomSelect>
        )
      case 'userTypeCds':
        return (
          <FormGroup style={{ display: 'flex' }}>
            {userTypeCodeList.data.map((codeObj: CodeObj) => (
              <FormControlLabel
                key={codeObj.cdNm}
                control={
                  <CustomCheckbox
                    name="userTypeCds"
                    value={codeObj.cdNm}
                    className="mui-custom-select required"
                    onKeyDown={stopArrowKeyPropagation}
                    checked={editedRow.userTypeCds.includes(codeObj.cdNm)}
                    onChange={(e) => {
                      const newUserTypeCds = e.target.checked
                        ? [...editedRow.userTypeCds, codeObj.cdNm]
                        : editedRow.userTypeCds.filter(
                            (cd) => cd !== codeObj.cdNm,
                          )
                      onInputChange('userTypeCds', newUserTypeCds)
                    }}
                    disabled={editedRow.menuAcsAuthrtCd !== 'MAA001'}
                  />
                }
                label={codeObj.cdKornNm}
              />
            ))}
          </FormGroup>
        )
      case 'npagYn':
        return (
          <RadioGroup
            row
            id="npagYn"
            aria-label="npagYn"
            className="mui-custom-radio-group required"
            value={editedRow?.npagYn}
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'npagYn')!,
              (e: React.ChangeEvent<HTMLInputElement>) =>
                onInputChange('npagYn', e.target.value),
            )}
          >
            &nbsp;
            <FormControlLabel
              control={<CustomRadio id="npagYn_Y" name="npagYn" value="Y" />}
              label="Y"
            />
            <FormControlLabel
              control={<CustomRadio id="npagYn_N" name="npagYn" value="N" />}
              label="N"
            />
          </RadioGroup>
        )
      case 'menuSeq':
        return (
          <CustomTextField
            value={editedRow.menuSeq}
            className="mui-custom-textarea required"
            onKeyDown={stopArrowKeyPropagation}
            type="number"
            error={!!errors.menuSeq}
            helperText={errors.menuSeq}
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'menuSeq')!,
              (e: React.ChangeEvent<HTMLInputElement>) =>
                onInputChange('menuSeq', e.target.value),
            )}
          />
        )
      case 'menuNm':
        return (
          <div>
            <CustomTextField
              id="menuNm"
              variant="outlined"
              className="mui-custom-textarea required"
              onKeyDown={stopArrowKeyPropagation}
              fullWidth
              error={!!errors.menuNm}
              helperText={errors.menuNm}
              defaultValue={editedRow.menuNm}
              inputRef={inputRef}
              {...getInputProps(
                fieldConfig.find((field) => field.name === 'menuNm')!,
                (e: React.ChangeEvent<HTMLInputElement>) =>
                  onInputChange('menuNm', e.target.value),
              )}
              //onChange={(e: React.ChangeEvent<HTMLInputElement>) => onInputChange('menuNm', e.target.value)}
            />
          </div>
        )
      case 'urlAddr':
        return (
          <CustomTextField
            id="urlAddr"
            variant="outlined"
            className="mui-custom-textarea required"
            onKeyDown={stopArrowKeyPropagation}
            fullWidth
            error={!!errors.urlAddr}
            helperText={errors.urlAddr}
            value={editedRow?.urlAddr || ''}
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'urlAddr')!,
              (e: React.ChangeEvent<HTMLInputElement>) =>
                onInputChange('urlAddr', e.target.value),
            )}
          />
        )
      case 'httpDmndMethNm':
        return (
          <CustomSelect
            id="httpDmndMethNm"
            type="select"
            className="mui-custom-select required"
            value={editedRow?.httpDmndMethNm}
            onKeyDown={stopArrowKeyPropagation}
            variant="outlined"
            fullWidth
            error={!!errors.httpDmndMethNm}
            {...getInputProps(
              fieldConfig.find((field) => field.name === 'httpDmndMethNm')!,
              (e: React.ChangeEvent<HTMLSelectElement>) =>
                onInputChange('httpDmndMethNm', e.target.value),
            )}
          >
            {selectHttpData.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </CustomSelect>
        )
    }
  } else {
    // 조회 모드일 때의 로직
    switch (fieldName) {
      case 'menuTypeCd':
        const menuTypeObj = menuTypeCodeList.data.find(
          (code) => code.cdNm === params.value,
        )
        return menuTypeObj ? menuTypeObj.cdKornNm : params.value
      case 'menuAcsAuthrtCd':
        const menuAcsAuthrtObj = menuAcsAuthrtCodeList.data.find(
          (code) => code.cdNm === params.value,
        )
        return menuAcsAuthrtObj ? menuAcsAuthrtObj.cdKornNm : params.value
      case 'npagYn':
        return params.value === 'Y' ? '네' : '아니오'
      // case 'userTypeCds':
      //   const userTypeNm = params.row.userTypeCds.map(cd=>userTypeCodeList.data
      //     .find(code=>code.cdNm === cd)?.cdKornNm).filter(Boolean).join('\n');
      //   return <div style={{ whiteSpace: 'pre-wrap' }}>{userTypeNm || '-'}</div>
      case 'menuNm':
        return params.value
      case 'urlAddr':
        return params.value
      case 'httpDmndMethNm':
        return params.value
      case 'menuSeq':
        return params.value
    }
  }
}

export default EditableCell
