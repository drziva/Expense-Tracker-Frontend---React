import z from "zod";
import { signupSchema } from "../schemas/signup.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, Box, Button, CircularProgress, Divider, Paper, TextField, Typography } from "@mui/material";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { useSignUp } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "@/shared/components/GoogleLoginButton";

type formInput = z.input<typeof signupSchema>;
type formOutput = z.output<typeof signupSchema>;

export default function SignUpPage() {
	const navigate = useNavigate();
	const form  = useForm<formInput, any, formOutput>({
			resolver: zodResolver(signupSchema),
			reValidateMode: "onSubmit",
			defaultValues: {
					username: "",
					email: "",
					password: "",
					confirmPassword: ""
			}
	});

	const signUp = useSignUp(); 

	const { isPending, isError, error } = signUp;

	const { formState: { errors }, handleSubmit, register } = form;

	const onSubmit = async (formData: formOutput) => {
		await signUp.mutateAsync(formData)
	}

	return (
		<>
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					placeItems: "center",
					background: theme =>
						`radial-gradient(circle at top, ${theme.palette.primary.main} 0%, ${theme.palette.background.default} 100%)`,
				}}
			>
				<Box
					component="img"
					src="/vega-it-logo-2.png"
					alt="VegaIT"
					sx={{
						height: 132,
						filter: theme => theme.palette.mode === "light" ? "invert(1)" : "none",
						transition: "filter 0.2s ease"
					}}
				/>
				<Paper
					elevation={10}
					sx={{
						width: "90%",
						maxWidth: 420,
						p: 4,
						borderRadius: 3,
						backdropFilter: "blur(8px)",
					}}
				>
					
					<Box
						sx={{ 
							display: "flex", 
							flexDirection: "column", 
							gap: 2.5 
						}}
						component="form" 
						onSubmit={handleSubmit(onSubmit)} 
						autoComplete="off"
					>
						<Box sx={{ textAlign: "center", mb: 1 }}>
							<Box
								sx={{
									width: 56,
									height: 56,
									mx: "auto",
									mb: 1.5,
									borderRadius: "50%",
									display: "grid",
									placeItems: "center",
									backgroundColor: "primary.main",
									color: "primary.contrastText",
								}}
							>
								<WavingHandIcon fontSize="small"/>
							</Box>
							<Typography variant="h5" fontWeight={600}>
								Welcome
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Sign up to continue
							</Typography>
						</Box>

						{isError && (
							<Alert severity="error">
								{error?.response?.data.message}
							</Alert>
						)}

						<TextField
							{...register("username")}
							label="Username"
							autoComplete="new-user"
							error={!!errors.username}
							helperText={errors.username?.message}
							fullWidth
							slotProps={{
								htmlInput: {
									"data-cy": "signup-username",
								},
							}}
						/>

						<TextField
							{...register("email")}
							error={!!errors.email}
							autoComplete="new-email"
							helperText={errors.email?.message}
							label="Email"
							fullWidth
							slotProps={{
								htmlInput: {
									"data-cy": "signup-email",
								},
							}}
						/>

						<TextField
							{...register("password")}
							error={!!errors.password}
							autoComplete="new-password"
							helperText={errors.password?.message}
							label="Password"
							type="password"
							fullWidth
							slotProps={{
								htmlInput: {
									"data-cy": "signup-password",
								},
							}}
						/>

						<TextField
							{...register("confirmPassword")}
							error={!!errors.confirmPassword}
							helperText={errors.confirmPassword?.message}
							autoComplete="new-password"
							label="Confirm Password"
							type="password"
							fullWidth
							slotProps={{
									htmlInput: {
									"data-cy": "signup-confirm-password",
									},
							}}
						/>

						<Box sx={{ textAlign: "left", mt: 1 }}>
						<Typography variant="subtitle2" color="text.secondary">
							Already have an account?
						</Typography>

						<Typography
							variant="subtitle2"
							color="text.primary"
							sx={{
							cursor: "pointer",
							textDecoration: "underline",
							mt: 0.5,
							}}
							onClick={() => navigate("/login")}
						>
							Log In
						</Typography>
						</Box>

						<Button
							name="submit"
							type="submit"
							size="large"
							variant="contained"
							disabled={isPending}
							sx={{
								mt: 1,
								py: 1.2,
								fontWeight: 600,
							}}
							data-cy="signup-submit"
						>
							{isPending ? (
								<CircularProgress size={22} color="inherit" />
							) : (
								"Sign up"
							)}
						</Button>
			
						<Divider>
						<Typography variant="body2" color="text.secondary">
							OR
						</Typography>
						</Divider>
											
						<GoogleLoginButton />
					</Box>
				</Paper>
			</Box>
		</>
	)
}