import { Card, CardHeader, CardContent, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AppState } from '@/store/store'
import { useSelector } from '@/store/hooks'

type Props = {
  className?: string
  children: JSX.Element | JSX.Element[]
  title?: string
  sx?: any
}

const BlankCard = ({ title, children, className, sx }: Props) => {
  const customizer = useSelector((state: AppState) => state.customizer)

  const theme = useTheme()
  const borderColor = theme.palette.divider

  return (
    <Card
      sx={{
        p: 0,
        border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none',
        position: 'relative',
        sx,
      }}
      className={className}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      {title ? (
        <>
          <CardHeader title={title} />
          <Divider />{' '}
        </>
      ) : (
        ''
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default BlankCard
