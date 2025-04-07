export const SocialLoginView = ({ msg }: { msg: any }) => {
  return (
    <div className="rounded-md bg-yellow-100 p-1">
      <h1>social login view</h1>
      <pre className="text-xs bg-yellow-100 p-1">
        {JSON.stringify(msg, null, 2)}
      </pre>
    </div>
  );
};
