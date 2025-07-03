import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";

type SelectOption = {
  id: string | number;
  title: string;
  imageUrl?: string;
};

type SelectWithPreviewProps<T extends SelectOption> = {
  label: string;
  value: string | number;
  options: T[];
  onChange: (value: string | number) => void;
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  helperTextColor?: "text.secondary" | "warning.main";
  imageVariant?: "circular" | "rounded";
};

export function SelectWithPreview<T extends SelectOption>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder,
  helperText,
  helperTextColor = "text.secondary",
  imageVariant = "rounded",
}: SelectWithPreviewProps<T>) {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  const renderValue = (selected: string | number) => {
    if (!selected) return "";
    const option = options.find((opt) => opt.id === selected);
    if (!option) return "";

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {option.imageUrl && (
          <Avatar
            src={option.imageUrl}
            variant={imageVariant}
            sx={{ width: 30, height: 30, mr: 2 }}
          />
        )}
        <ListItemText primary={option.title} />
      </Box>
    );
  };

  return (
    <>
      <FormControl fullWidth={true}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
          disabled={disabled}
          renderValue={renderValue}
          displayEmpty={!!placeholder}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id} sx={{ py: 1 }}>
              {option.imageUrl && (
                <ListItemIcon>
                  <Avatar
                    src={option.imageUrl}
                    variant={imageVariant}
                    sx={{ width: 64, height: 64 }}
                  />
                </ListItemIcon>
              )}
              <ListItemText
                primary={option.title}
                sx={{ ml: option.imageUrl ? 2 : 0 }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {helperText && (
        <Typography
          variant="caption"
          color={helperTextColor}
          sx={{ mt: 1, display: "block" }}
        >
          {helperText}
        </Typography>
      )}
    </>
  );
}
