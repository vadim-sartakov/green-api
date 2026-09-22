import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { AuthCredentials } from '@/store/slices/auth';

type LoginProps = {
  onLogin: (credentials: AuthCredentials) => void;
};

function Login({ onLogin }: LoginProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <form
        className="w-full max-w-sm"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const idInstanceValue = formData.get('idInstance');
          const apiTokenInstanceValue = formData.get('apiTokenInstance');

          if (
            typeof idInstanceValue !== 'string' ||
            typeof apiTokenInstanceValue !== 'string'
          ) {
            return;
          }

          const idInstance = idInstanceValue.trim();
          const apiTokenInstance = apiTokenInstanceValue.trim();

          if (idInstance && apiTokenInstance) {
            onLogin({ idInstance, apiTokenInstance });
          }
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Green Api</CardTitle>
            <CardDescription className="text-sm leading-6">
              Enter your Green API credentials to continue.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="idInstance">idInstance</FieldLabel>
                <Input
                  id="idInstance"
                  name="idInstance"
                  placeholder="Enter your idInstance"
                  type="text"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="apiTokenInstance">
                  apiTokenInstance
                </FieldLabel>
                <Input
                  id="apiTokenInstance"
                  name="apiTokenInstance"
                  placeholder="Enter your apiTokenInstance"
                  type="text"
                />
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <Button className="w-full" type="submit">
              Continue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}

export default Login;
