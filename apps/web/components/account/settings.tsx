import {
    SettingsCard,
    SettingsCardTitle,
    SettingsCardContent,
    SettingsCardFooter,
} from "../settings-card";
import { ChangePassword } from "./change-password";
import { EditDisplayName } from "./edit-display-name";

export function Settings({ displayName }: { displayName: string }) {
    return (
        <>
            <SettingsCard className='w-full' id='name_change'>
                <SettingsCardTitle>Display name</SettingsCardTitle>
                <SettingsCardContent className='space-y-4'>
                    <p className='text-sm'>
                        This is your public display name that will be shown to others through the
                        app.
                    </p>
                    <EditDisplayName displayName={displayName} />
                </SettingsCardContent>
                <SettingsCardFooter>
                    <p className='text-sm text-muted-foreground'>
                        Please note that this can be changed at any time.
                    </p>
                </SettingsCardFooter>
            </SettingsCard>
            <SettingsCard className='w-full' id='password_change'>
                <SettingsCardTitle>Change Password</SettingsCardTitle>
                <SettingsCardContent className='space-y-4'>
                    <p className='text-sm'>
                        Update your account password. To successfully change it, you must provide
                        your current password and a new password.
                    </p>
                </SettingsCardContent>
                <SettingsCardFooter className='py-2'>
                    <p className='text-sm text-muted-foreground'>
                        Make sure to choose a strong and unique one.
                    </p>
                    <ChangePassword />
                </SettingsCardFooter>
            </SettingsCard>
        </>
    );
}
