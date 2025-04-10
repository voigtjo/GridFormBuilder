// ✅ src/components/FormPreview.jsx
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const FormPreview = ({ rows, theme }) => {
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
          mb={1}
          sx={{
            backgroundColor: theme?.rowBg || '#ffffff',
            height: row.height || 80,
            border: `1px solid ${theme?.borderColor || '#ccc'}`
          }}
        >
          {row.cells.map((cell) => {
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
                  backgroundColor: theme?.cellBg || '#fff',
                  borderLeft: `1px solid ${theme?.borderColor || '#ccc'}`,
                  borderRight: `1px solid ${theme?.borderColor || '#ccc'}`,
                  textAlign: control?.hAlign || 'left'
                }}
              >
                {control?.type === 'markdown' ? (
                  <Box
                    width="100%"
                    maxWidth="100%"
                    overflow="hidden"
                    p={1}
                    sx={{
                      backgroundColor: `${theme?.controlBg || '#fff'} !important`,
                      border: `1px solid ${theme?.borderColor || '#ccc'}`,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      color: theme?.textColor || 'inherit',
                      fontFamily: theme?.fontFamily || 'inherit'
                    }}
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        h1: ({ node, ...props }) => (
                          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: theme?.textColor }} {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: theme?.textColor }} {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <Typography variant="body2" gutterBottom sx={{ color: theme?.textColor }} {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <Box component="ul" pl={2} sx={{ mb: 1, color: theme?.textColor }} {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <Box component="ol" pl={2} sx={{ mb: 1, color: theme?.textColor }} {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li style={{ marginBottom: 4, color: theme?.textColor }}>{props.children}</li>
                        )
                      }}
                    >
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
                ) : null}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  );
};

export default FormPreview;