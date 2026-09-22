import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { AuthCredentials } from '@/store/slices/auth';
import { useForm } from 'react-hook-form';

type LoginProps = {
  onLogin: (credentials: AuthCredentials) => void;
};

function Login({ onLogin }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthCredentials>();

  const submitLogin = (credentials: AuthCredentials) => {
    onLogin({
      idInstance: credentials.idInstance.trim(),
      apiTokenInstance: credentials.apiTokenInstance.trim(),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8">
      <form className="w-full max-w-sm" onSubmit={handleSubmit(submitLogin)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Green Api</CardTitle>
            <CardDescription className="text-sm leading-6">
              Введите данные Green Api, чтобы продолжить.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <Field data-invalid={!!errors.idInstance}>
                <FieldLabel htmlFor="idInstance">
                  idInstance
                </FieldLabel>
                <Input
                  id="idInstance"
                  placeholder="Введите idInstance"
                  type="text"
                  aria-invalid={!!errors.idInstance}
                  {...register('idInstance', {
                    required: 'idInstance обязателен',
                  })}
                />
                <FieldError errors={[errors.idInstance]} />
              </Field>

              <Field data-invalid={!!errors.apiTokenInstance}>
                <FieldLabel htmlFor="apiTokenInstance">
                  apiTokenInstance
                </FieldLabel>
                <Input
                  id="apiTokenInstance"
                  placeholder="Введите apiTokenInstance"
                  type="text"
                  aria-invalid={!!errors.apiTokenInstance}
                  {...register('apiTokenInstance', {
                    required: 'apiTokenInstance обязателен',
                  })}
                />
                <FieldError errors={[errors.apiTokenInstance]} />
              </Field>
            </FieldGroup>
          </CardContent>

          <CardFooter>
            <Button className="w-full" type="submit">
              Продолжить
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
}

export default Login;
