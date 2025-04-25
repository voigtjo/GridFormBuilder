import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const GridBuilder = ({
  rows,
  setRows,
  selectedRowId,
  setSelectedRowId,
  selectedCellId,
  setSelectedCellId,
  theme,
  disabled = false
}) => {
  const handleRowSelect = (rowId) => {
    if (disabled) return;
    setSelectedRowId(rowId);
    setSelectedCellId(null);
  };

  const handleCellSelect = (rowId, cellId) => {
    if (disabled) return;
    setSelectedRowId(rowId);
    setSelectedCellId(cellId);
  };

  const handleAddRowToEnd = () => {
    if (disabled) return;
    const newRowId = `row-${Date.now()}`;
    const newRow = {
      id: newRowId,
      height: 80,
      cells: [
        {
          id: `${newRowId}-cell-0`,
          widthRatio: 1,
          control: null
        }
      ]
    };
    setRows([...rows, newRow]);
  };

  const getHorizontalAlign = (align) => {
    switch (align) {
      case 'center': return 'center';
      case 'right': return 'flex-end';
      case 'stretch': return 'stretch';
      default: return 'flex-start';
    }
  };

  const getVerticalAlign = (align) => {
    switch (align) {
      case 'center': return 'center';
      case 'bottom': return 'flex-end';
      default: return 'flex-start';
    }
  };

  return (
    <Box
      p={2}
      overflow="auto"
      flex={1}
      sx={{
        backgroundColor: theme?.formBg || '#fafafa',
        borderTop: `4px solid ${theme?.borderColor || '#ccc'}`
      }}
    >
      {rows.map((row) => (
        <Box
          key={row.id}
          display="flex"
          alignItems="stretch"
          border={`1px solid ${theme?.borderColor || '#ccc'}`}
          mb={1}
          sx={{
            backgroundColor: selectedRowId === row.id ? theme?.rowBg : theme?.rowBg,
            height: row.height || 80,
            position: 'relative'
          }}
        >
          {row.cells.map((cell) => {
            const isSelected = selectedCellId === cell.id;
            const control = cell.control;

            return (
              <Box
                key={cell.id}
                sx={{
                  flex: `${cell.widthRatio || 1} ${cell.widthRatio || 1} 0`,
                  minWidth: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: getVerticalAlign(control?.vAlign),
                  justifyContent: getHorizontalAlign(control?.hAlign),
                  p: 1,
                  backgroundColor: isSelected ? theme?.cellBg : theme?.cellBg,
                  borderLeft: `1px solid ${theme?.borderColor}`,
                  borderRight: `1px solid ${theme?.borderColor}`,
                  cursor: disabled ? 'default' : 'pointer',
                  position: 'relative',
                  textAlign: control?.hAlign || 'left'
                }}
                onClick={() => handleCellSelect(row.id, cell.id)}
              >
                {control?.type === 'markdown' ? (
                  <Box
                    width="100%"
                    maxWidth="100%"
                    overflow="hidden"
                    p={1}
                    sx={{
                      backgroundColor: `${theme?.controlBg} !important`,
                      border: `1px solid ${theme?.borderColor}`,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: theme?.textColor,
                      fontFamily: theme?.fontFamily
                    }}
                  >
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                      {control.content || ''}
                    </ReactMarkdown>
                  </Box>
                ) : control?.type === 'input' ? (
                  <Box width={control.hAlign === 'stretch' ? '100%' : 'fit-content'} minWidth={160}>
                    <TextField
                      fullWidth={control.hAlign === 'stretch'}
                      size="small"
                      label={control.label || 'Input'}
                      type={control.inputType === 'integer' ? 'number' : control.inputType}
                      inputProps={control.inputType === 'integer' ? { step: 1 } : { step: 'any' }}
                      variant="outlined"
                    />
                  </Box>
                ) : control?.type === 'dropdown' ? (
                  <FormControl size="small" sx={{ minWidth: 160, width: control.hAlign === 'stretch' ? '100%' : 'fit-content' }}>
                    <InputLabel>{control.label || 'Select'}</InputLabel>
                    <Select label={control.label || 'Select'} defaultValue="">
                      {control.options?.map((opt, idx) => (
                        <MenuItem key={idx} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : control?.type === 'date' ? (
                  <Box width={control.hAlign === 'stretch' ? '100%' : 'fit-content'} minWidth={160}>
                    <TextField
                      fullWidth={control.hAlign === 'stretch'}
                      type="date"
                      label={control.label || 'Select Date'}
                      size="small"
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                ) : control?.type === 'checkbox' ? (
                  <FormControlLabel
                    control={<Checkbox checked={control.checked || false} disabled />}
                    label={control.label || 'Checkbox'}
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">Empty Cell</Typography>
                )}

                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 2, right: 2 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCellSelect(row.id, cell.id);
                  }}
                  disabled={disabled}
                >
                  <BorderColorIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}

          <IconButton
            size="small"
            sx={{
              position: 'absolute',
              top: '50%',
              right: -20,
              transform: 'translateY(-50%)',
              backgroundColor: theme?.formBg,
              border: `1px solid ${theme?.borderColor}`,
              zIndex: 2
            }}
            onClick={() => handleRowSelect(row.id)}
            disabled={disabled}
          >
            <BorderColorIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}

      {!selectedRowId && (
        <Box textAlign="center" mt={2}>
          <IconButton
            onClick={handleAddRowToEnd}
            color="primary"
            sx={{
              backgroundColor: theme?.controlBg,
              border: `1px dashed ${theme?.borderColor}`
            }}
            disabled={disabled}
          >
            <BorderColorIcon />
          </IconButton>
          <Typography variant="body2" mt={1}>Add Row</Typography>
        </Box>
      )}
    </Box>
  );
};

export default GridBuilder;
