import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useToast } from "mtxuilib/ui/use-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTenantId, useUser } from "../../hooks/useAuth";
import { UserFAB } from "../UserFAB";

// Mock the hooks and dependencies
vi.mock("../../hooks/useAuth");
vi.mock("@tanstack/react-router");
vi.mock("mtmaiapi");
vi.mock("mtxuilib/ui/use-toast");
vi.mock("mtxuilib/components/MtSuspenseBoundary", () => ({
  MtSuspenseBoundary: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="suspense-boundary">{children}</div>
  ),
}));

// Mock ReactQueryStreamedHydration to fix import error
vi.mock(
  "@tanstack/react-query-next-experimental",
  () => ({
    ReactQueryStreamedHydration: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
  { virtual: true },
);

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useSuspenseQuery: vi.fn(),
  };
});

// Mock UI components
vi.mock("mtxuilib/ui/button", () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} data-testid="fab-button" {...props}>
      {children}
    </button>
  ),
}));

vi.mock("mtxuilib/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dropdown-menu" data-open={open}>
      {children}
    </div>
  ),
  DropdownMenuTrigger: ({ children }: any) => <div data-testid="dropdown-trigger">{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div data-testid="dropdown-content">{children}</div>,
  DropdownMenuLabel: ({ children }: any) => <div data-testid="dropdown-label">{children}</div>,
  DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
  DropdownMenuGroup: ({ children }: any) => <div data-testid="dropdown-group">{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div data-testid="dropdown-item" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuSub: ({ children }: any) => <div data-testid="dropdown-sub">{children}</div>,
  DropdownMenuSubTrigger: ({ children }: any) => (
    <div data-testid="dropdown-sub-trigger">{children}</div>
  ),
  DropdownMenuSubContent: ({ children }: any) => (
    <div data-testid="dropdown-sub-content">{children}</div>
  ),
  DropdownMenuPortal: ({ children }: any) => <div data-testid="dropdown-portal">{children}</div>,
  DropdownMenuShortcut: ({ children }: any) => (
    <span data-testid="dropdown-shortcut">{children}</span>
  ),
}));

vi.mock("mtxuilib/icons/icons", () => ({
  Icons: {
    apple: () => <div data-testid="apple-icon">🍎</div>,
  },
  IconX: ({ name }: { name: string }) => <div data-testid={`icon-${name}`}>{name}</div>,
}));

vi.mock("mtxuilib/mt/CustomLink", () => ({
  CustomLink: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to} data-testid="custom-link">
      {children}
    </a>
  ),
}));

vi.mock("mtxuilib/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

// Define mock types for testing
interface MockUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  userToken: string;
  metadata: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

describe("UserFAB", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(useToast).mockReturnValue({
      toast: vi.fn(),
      dismiss: vi.fn(),
      toasts: [],
    });
    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
  };

  describe("Component Rendering", () => {
    it("should render the FAB button", () => {
      vi.mocked(useUser).mockReturnValue(undefined);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");

      renderWithQueryClient(<UserFAB />);

      expect(screen.getByTestId("fab-button")).toBeInTheDocument();
      expect(screen.getByTestId("apple-icon")).toBeInTheDocument();
    });

    it("should apply correct CSS classes to the button", () => {
      vi.mocked(useUser).mockReturnValue(undefined);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");

      renderWithQueryClient(<UserFAB />);

      const button = screen.getByTestId("fab-button");
      expect(button).toHaveClass("fixed", "bottom-14", "right-4", "z-40");
    });
  });

  describe("User Authentication States", () => {
    it("should navigate to login when user is not authenticated and button is clicked", () => {
      const mockNavigate = vi.fn();
      vi.mocked(useUser).mockReturnValue(undefined);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");
      vi.mocked(useNavigate).mockReturnValue(mockNavigate);

      renderWithQueryClient(<UserFAB />);

      const button = screen.getByTestId("fab-button");
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/auth/login",
      });
    });

    it("should show dropdown menu when user is authenticated", () => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        emailVerified: true,
        userToken: "token",
        metadata: {
          id: "123",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      };
      vi.mocked(useUser).mockReturnValue(mockUser as any);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: {
          sideritems: [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: "dashboard",
              children: [{ title: "Overview", url: "/dashboard/overview" }],
            },
          ],
        },
        status: "success",
        error: null,
        isError: false,
        isPending: false,
        isSuccess: true,
        isFetching: false,
        isFetched: true,
        isStale: false,
        isLoading: false,
        isRefetching: false,
        failureReason: null,
        failureCount: 0,
        fetchStatus: "idle",
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
      } as any);

      renderWithQueryClient(<UserFAB />);

      expect(screen.getByTestId("dropdown-content")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-label")).toHaveTextContent("My Account");
    });

    it("should not show dropdown content when user is not authenticated", () => {
      vi.mocked(useUser).mockReturnValue(undefined);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");

      renderWithQueryClient(<UserFAB />);

      expect(screen.queryByTestId("dropdown-content")).not.toBeInTheDocument();
    });
  });

  describe("Dropdown Menu Functionality", () => {
    beforeEach(() => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        emailVerified: true,
        userToken: "token",
        metadata: {
          id: "123",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      };
      vi.mocked(useUser).mockReturnValue(mockUser as any);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: {
          sideritems: [
            {
              title: "Dashboard",
              url: "/dashboard",
              icon: "dashboard",
              children: [
                { title: "Overview", url: "/dashboard/overview" },
                { title: "Analytics", url: "/dashboard/analytics" },
              ],
            },
          ],
        },
        status: "success",
        error: null,
        isError: false,
        isPending: false,
        isSuccess: true,
        isFetching: false,
        isFetched: true,
        isStale: false,
        isLoading: false,
        isRefetching: false,
        failureReason: null,
        failureCount: 0,
        fetchStatus: "idle",
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
      } as any);
    });

    it("should render sidebar items from API", () => {
      renderWithQueryClient(<UserFAB />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("should render logout menu item", () => {
      renderWithQueryClient(<UserFAB />);

      expect(screen.getByText("Log out")).toBeInTheDocument();
      expect(screen.getByTestId("dropdown-shortcut")).toHaveTextContent("⇧⌘Q");
    });

    it("should handle logout click", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      renderWithQueryClient(<UserFAB />);

      const logoutItem = screen.getByText("Log out").closest('[data-testid="dropdown-item"]');
      fireEvent.click(logoutItem!);

      expect(consoleSpy).toHaveBeenCalledWith("TODO: logout");

      consoleSpy.mockRestore();
    });
  });

  describe("Testing Menu Content", () => {
    beforeEach(() => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        emailVerified: true,
        userToken: "token",
        metadata: {
          id: "123",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      };
      vi.mocked(useUser).mockReturnValue(mockUser as any);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { sideritems: [] },
        status: "success",
        error: null,
        isError: false,
        isPending: false,
        isSuccess: true,
        isFetching: false,
        isFetched: true,
        isStale: false,
        isLoading: false,
        isRefetching: false,
        failureReason: null,
        failureCount: 0,
        fetchStatus: "idle",
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
      } as any);
    });

    it("should render testing menu with test action", async () => {
      // Mock fetch for the test action
      const mockFetchImpl = {
        text: () => Promise.resolve("test response"),
      };
      global.fetch = vi.fn().mockResolvedValue(mockFetchImpl);

      renderWithQueryClient(<UserFAB />);

      expect(screen.getByText("临时测试")).toBeInTheDocument();
      expect(screen.getByText("测试1")).toBeInTheDocument();
    });

    it("should handle test action click", async () => {
      const mockFetchImpl = {
        text: () => Promise.resolve("test response"),
      };
      const mockFetch = vi.fn().mockResolvedValue(mockFetchImpl);
      global.fetch = mockFetch;
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      renderWithQueryClient(<UserFAB />);

      const testItem = screen.getByText("测试1").closest('[data-testid="dropdown-item"]');
      fireEvent.click(testItem!);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "https://text.pollinations.ai/openai",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "openai-audio",
              messages: [{ role: "user", content: "你好" }],
              voice: "alloy",
            }),
          }),
        );
      });

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith("test response");
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Admin Menu Content", () => {
    beforeEach(() => {
      const mockUser = {
        id: "user-1",
        name: "Test User",
        email: "test@example.com",
        emailVerified: true,
        userToken: "token",
        metadata: {
          id: "123",
          createdAt: "2023-01-01",
          updatedAt: "2023-01-02",
        },
      };
      vi.mocked(useUser).mockReturnValue(mockUser as any);
      vi.mocked(useTenantId).mockReturnValue("tenant-1");
      vi.mocked(useSuspenseQuery).mockReturnValue({
        data: { sideritems: [] },
        status: "success",
        error: null,
        isError: false,
        isPending: false,
        isSuccess: true,
        isFetching: false,
        isFetched: true,
        isStale: false,
        isLoading: false,
        isRefetching: false,
        failureReason: null,
        failureCount: 0,
        fetchStatus: "idle",
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
      } as any);
    });

    it("should render admin menu", () => {
      renderWithQueryClient(<UserFAB />);

      expect(screen.getByText("管理")).toBeInTheDocument();
    });
  });
});
