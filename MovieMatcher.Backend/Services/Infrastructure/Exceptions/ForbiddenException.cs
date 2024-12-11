using System;

namespace EyeRide.FMS.Model.Infrastructure.Exceptions;

/// <summary>
/// Thrown when access to a resource is forbidden, even if the user is authenticated.
/// Use this exception for cases where the user is explicitly denied access due
/// to business rules or other constraints.
/// </summary>
public class ForbiddenException : DomainException
{
    public ForbiddenException(string message)
        : base(message)
    {
    }

    public ForbiddenException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}