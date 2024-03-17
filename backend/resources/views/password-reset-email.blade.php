<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset Token</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">
            Your Password Reset Token
        </h2>
        <p style="font-size: 16px; color: #666;">
            Here is your password reset token:
        </p>
        <p style="font-size: 18px; color: #333; padding: 10px 20px; background-color: #f5f5f5; border-radius: 5px;">
            {{ $token }}
        </p>
        <p style="font-size: 16px; color: #666;">
            This token is valid for a limited time. Please use it to reset your password.
        </p>
    </div>
</body>
</html>
